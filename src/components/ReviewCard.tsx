import { useState } from 'react';
import { Star, BadgeCheck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ReviewCardProps {
  review: {
    id: string;
    clientName: string;
    clientAvatar: string;
    rating: number;
    reviewText: string;
    photos?: string[];
    isVerifiedBooking: boolean;
    createdAt: string;
    workerResponse?: string;
    workerResponseDate?: string;
  };
  isWorker?: boolean;
  onRespond?: (reviewId: string, response: string) => void;
}

export default function ReviewCard({ review, isWorker, onRespond }: ReviewCardProps) {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmitResponse = () => {
    if (onRespond && response.trim()) {
      onRespond(review.id, response);
      setShowResponseForm(false);
      setResponse('');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border">
      <div className="flex items-start gap-4 mb-4">
        <Avatar>
          <AvatarImage src={review.clientAvatar} />
          <AvatarFallback>{review.clientName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{review.clientName}</h4>
            {review.isVerifiedBooking && (
              <Badge variant="secondary" className="text-xs">
                <BadgeCheck className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 mb-3">{review.reviewText}</p>
          
          {review.photos && review.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {review.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt=""
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          )}

          {review.workerResponse && (
            <div className="bg-gray-50 rounded-lg p-4 mt-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-sm">Response from worker</span>
                <span className="text-xs text-gray-500">
                  {new Date(review.workerResponseDate!).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{review.workerResponse}</p>
            </div>
          )}

          {isWorker && !review.workerResponse && !showResponseForm && (
            <Button
              onClick={() => setShowResponseForm(true)}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Respond
            </Button>
          )}

          {showResponseForm && (
            <div className="mt-3">
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write your response..."
                rows={3}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmitResponse} size="sm">Submit</Button>
                <Button onClick={() => setShowResponseForm(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
