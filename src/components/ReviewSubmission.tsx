import { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ReviewSubmissionProps {
  workerId: string;
  workerName: string;
  bookingId?: string;
  onSubmit: (review: any) => void;
  onCancel: () => void;
}

export default function ReviewSubmission({ workerId, workerName, bookingId, onSubmit, onCancel }: ReviewSubmissionProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setPhotos(prev => [...prev, ...Array.from(files)]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Run AI moderation check on review text
      const { data: moderationData, error: moderationError } = await supabase.functions.invoke('moderate-content', {
        body: {
          content: reviewText,
          contentType: 'review',
          userId: user.id,
          referenceId: null // Will be set after review is created
        }
      });

      // Block submission if high confidence inappropriate content
      if (moderationData?.shouldBlock) {
        toast({ 
          title: 'Content Flagged', 
          description: 'Your review contains inappropriate content and cannot be submitted.', 
          variant: 'destructive' 
        });
        setIsSubmitting(false);
        return;
      }

      const photoUrls: string[] = [];
      for (const photo of photos) {
        const fileName = `${user.id}/${Date.now()}_${photo.name}`;
        const { data, error } = await supabase.storage.from('review-photos').upload(fileName, photo);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('review-photos').getPublicUrl(fileName);
        photoUrls.push(publicUrl);
      }

      const { data, error } = await supabase.from('reviews').insert({
        reviewer_id: user.id,
        worker_id: workerId,
        booking_id: bookingId,
        rating,
        review_text: reviewText,
        photos: photoUrls,
        verified_booking: !!bookingId,
        status: moderationData?.flagged ? 'pending' : 'approved'
      }).select().single();

      if (error) throw error;

      // Update content flag with review ID if flagged
      if (moderationData?.flagged && data.id) {
        await supabase.from('content_flags').update({ content_id: data.id }).eq('user_id', user.id).eq('content_type', 'review').is('content_id', null);
      }

      toast({ 
        title: 'Success', 
        description: moderationData?.flagged ? 'Review submitted for moderation' : 'Review published successfully' 
      });
      onSubmit(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Review {workerName}</h2>
      {bookingId && <Badge className="mb-4 bg-blue-100 text-blue-800">Verified Booking</Badge>}
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="transition-transform hover:scale-110">
              <Star className={`w-10 h-10 ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Your Review</label>
        <Textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience..." rows={5} className="w-full" />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Add Photos</label>
        <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
        <label htmlFor="photo-upload">
          <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Click to upload photos</p>
          </div>
        </label>
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center text-sm">{photo.name}</div>
                <button onClick={() => removePhoto(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting} className="flex-1">{isSubmitting ? 'Submitting...' : 'Submit Review'}</Button>
        <Button onClick={onCancel} variant="outline">Cancel</Button>
      </div>
    </div>
  );
}
