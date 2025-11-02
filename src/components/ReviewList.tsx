import { useState } from 'react';
import { Star, Filter } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReviewListProps {
  reviews: any[];
  isWorker?: boolean;
  onRespond?: (reviewId: string, response: string) => void;
}

export default function ReviewList({ reviews, isWorker, onRespond }: ReviewListProps) {
  const [filterRating, setFilterRating] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  const filteredReviews = reviews
    .filter(review => filterRating === 'all' || review.rating === parseInt(filterRating))
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'highest') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex items-start gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{averageRating}</div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(parseFloat(averageRating))
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">{reviews.length} reviews</p>
          </div>

          <div className="flex-1">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3 mb-2">
                <span className="text-sm w-12">{rating} star</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isWorker={isWorker}
            onRespond={onRespond}
          />
        ))}
      </div>
    </div>
  );
}
