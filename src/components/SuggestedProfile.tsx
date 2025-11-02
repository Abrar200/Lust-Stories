import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star } from 'lucide-react';

interface SuggestedProfileProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  images: string[];
  price: string;
  bio: string;
  onFollow: (id: string) => void;
  isFollowing: boolean;
  onViewProfile?: () => void;
}

export const SuggestedProfile: React.FC<SuggestedProfileProps> = ({
  id,
  name,
  location,
  rating,
  images,
  price,
  bio,
  onFollow,
  isFollowing,
  onViewProfile,
}) => {
  return (
    <Card className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-3 gap-1 cursor-pointer group" onClick={onViewProfile}>
        {images.map((img, idx) => (
          <div key={idx} className="relative overflow-hidden">
            <img src={img} alt={name} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/10 transition-colors duration-500" />
          </div>
        ))}
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="cursor-pointer" onClick={onViewProfile}>
            <h3 className="font-bold text-lg text-zinc-900 hover:text-pink-600 transition-colors duration-300">{name}</h3>
            <div className="flex items-center gap-1 text-sm text-zinc-600">
              <MapPin className="w-3 h-3" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 transition-transform duration-300 hover:scale-125 hover:rotate-12" />
              <span className="text-sm font-semibold text-zinc-900">{rating}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-pink-600">{price}</p>
            <p className="text-xs text-zinc-500">per hour</p>
          </div>
        </div>
        <p className="text-sm text-zinc-600 line-clamp-2">{bio}</p>
        <div className="flex gap-2">
          <Button
            onClick={onViewProfile}
            variant="outline"
            className="flex-1 rounded-full border-pink-300 text-pink-600 hover:bg-pink-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            View Profile
          </Button>
          <Button
            onClick={() => onFollow(id)}
            className={`flex-1 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isFollowing
                ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 hover:shadow-lg'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>
      </div>
    </Card>
  );

};
