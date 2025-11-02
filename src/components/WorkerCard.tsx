import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star } from 'lucide-react';
import { BookingModal } from './BookingModal';
import { useNavigate } from 'react-router-dom';

interface WorkerCardProps {
  id: string;
  name: string;
  avatar: string;
  type: string;
  rating: number;
  reviewCount?: number;
  price: number;
  location: string;
  age?: number;
  bio?: string;
  verified: boolean;
  online: boolean;
  services: string[];
  onMessage: () => void;
  onBook: () => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  id, name, avatar, type, rating, reviewCount, price, location, age, bio, verified, services
}) => {
  const [showBooking, setShowBooking] = useState(false);
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/profile/${id}`);
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
        <div className="relative cursor-pointer overflow-hidden" onClick={handleViewProfile}>
          <img src={avatar || '/placeholder.svg'} alt={name} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {verified && (
            <Badge className="absolute top-3 left-3 bg-pink-600 text-white border-0 animate-in fade-in slide-in-from-left duration-500">Verified</Badge>
          )}
        </div>
        
        <div className="p-5">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-pink-600 transition-colors duration-300" onClick={handleViewProfile}>{name}</h3>
            <p className="text-sm text-gray-500">{type}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-pink-600 text-pink-600 transition-transform duration-300 hover:scale-125" />
              <span className="text-sm font-medium text-gray-900">{rating}</span>
              {reviewCount !== undefined && (
                <span className="text-sm text-gray-500">({reviewCount})</span>
              )}
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-600">{location}</p>
            {age && <p className="text-sm text-gray-600">Age: {age}</p>}
          </div>

          {bio && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bio}</p>
          )}

          <div className="flex items-center justify-between mb-4">
            <span className="text-pink-600 font-semibold text-lg">From ${price}</span>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleViewProfile} 
              variant="outline" 
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              View Profile
            </Button>
            <Button 
              onClick={() => setShowBooking(true)} 
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
            >
              Book
            </Button>
          </div>
        </div>
      </div>


      <BookingModal
        open={showBooking}
        onClose={() => setShowBooking(false)}
        workerName={name}
        workerAvatar={avatar}
        services={services.length > 0 ? services : ['Companionship', 'Entertainment', 'Events']}
        hourlyRate={price}
      />
    </>
  );
};
