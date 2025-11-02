import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, CheckCircle, XCircle, Flag, User, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const DEMO_REVIEWS = [
  { id: '1', worker_id: 'worker_abc123', worker_name: 'Sophia Martinez', reviewer_name: 'Michael Chen', rating: 5, review_text: 'Amazing experience! Very professional and exceeded all expectations. Highly recommend!', created_at: '2024-11-01T14:30:00Z', flagged: false, flag_reason: null },
  { id: '2', worker_id: 'worker_def456', worker_name: 'Isabella Rodriguez', reviewer_name: 'James Wilson', rating: 1, review_text: 'Terrible service. Did not show up on time and was very unprofessional. Complete waste of money.', created_at: '2024-11-01T12:15:00Z', flagged: true, flag_reason: 'Contains potentially false accusations and defamatory language' },
  { id: '3', worker_id: 'worker_ghi789', worker_name: 'Emma Thompson', reviewer_name: 'David Brown', rating: 4, review_text: 'Great service overall. Very friendly and accommodating. Only minor issue was timing but everything else was perfect.', created_at: '2024-10-31T18:45:00Z', flagged: false, flag_reason: null },
  { id: '4', worker_id: 'worker_jkl012', worker_name: 'Olivia Davis', reviewer_name: 'Anonymous User', rating: 5, review_text: 'Best experience ever! Click here to get 50% off: scamlink.com - Amazing service!', created_at: '2024-10-31T16:20:00Z', flagged: true, flag_reason: 'Contains spam links and promotional content' },
  { id: '5', worker_id: 'worker_mno345', worker_name: 'Ava Johnson', reviewer_name: 'Robert Taylor', rating: 5, review_text: 'Absolutely wonderful! Professional, punctual, and provided excellent service. Will definitely book again.', created_at: '2024-10-31T10:00:00Z', flagged: false, flag_reason: null },
  { id: '6', worker_id: 'worker_pqr678', worker_name: 'Mia Anderson', reviewer_name: 'Christopher Lee', rating: 3, review_text: 'Service was okay. Nothing special but nothing terrible either. Average experience overall.', created_at: '2024-10-30T20:30:00Z', flagged: false, flag_reason: null },
];

export default function ReviewModeration() {
  const [reviews, setReviews] = useState<any[]>(DEMO_REVIEWS);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | 'flagged'>('all');
  const { toast } = useToast();

  const handleApprove = (review: any) => {
    setReviews(prev => prev.filter(r => r.id !== review.id));
    toast({ title: 'Success', description: 'Review approved and published' });
  };

  const handleReject = () => {
    if (!selectedReview || !rejectionReason.trim()) return;
    setReviews(prev => prev.filter(r => r.id !== selectedReview.id));
    toast({ title: 'Success', description: 'Review rejected and user notified' });
    setShowRejectDialog(false);
    setRejectionReason('');
    setSelectedReview(null);
  };

  const filteredReviews = reviews.filter(r => filter === 'all' || r.flagged);

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Pending Reviews</h2>
          <p className="text-zinc-400 text-sm mt-1">{filteredReviews.length} reviews awaiting moderation</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'}
          >
            All Reviews
          </Button>
          <Button 
            variant={filter === 'flagged' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('flagged')}
            className={filter === 'flagged' ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'}
          >
            <Flag className="w-4 h-4 mr-1" />Flagged Only
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className={`bg-zinc-900 border-zinc-800 hover:border-pink-500/50 transition-colors ${review.flagged ? 'border-red-500/50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12 border-2 border-pink-500">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.worker_name}`} />
                    <AvatarFallback className="bg-pink-500 text-white">{review.worker_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{review.worker_name}</p>
                    <p className="text-sm text-zinc-400">Reviewed by: {review.reviewer_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      <span className="text-xs text-zinc-500">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {review.flagged && (
                  <Badge variant="destructive" className="flex items-center gap-1 bg-red-500">
                    <Flag className="w-3 h-3" />Flagged
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < review.rating ? 'fill-pink-500 text-pink-500' : 'text-zinc-700'}`} 
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-white">{review.rating}.0</span>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4 mb-4 border border-zinc-700">
                <p className="text-zinc-300 leading-relaxed">{review.review_text}</p>
              </div>

              {review.flagged && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Flag className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-500 mb-1">Flag Reason:</p>
                      <p className="text-sm text-red-400">{review.flag_reason}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleApprove(review)} 
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />Approve & Publish
                </Button>
                <Button 
                  onClick={() => { 
                    setSelectedReview(review); 
                    setShowRejectDialog(true); 
                  }} 
                  className="bg-pink-500 hover:bg-pink-600 text-white flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
            <p className="text-zinc-400">No pending reviews to moderate at this time.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Rejection Reason</label>
              <Textarea 
                value={rejectionReason} 
                onChange={(e) => setRejectionReason(e.target.value)} 
                placeholder="Enter detailed reason for rejection..." 
                rows={4}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowRejectDialog(false)}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReject} 
                disabled={!rejectionReason.trim()}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                Reject Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
