import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Calendar, Star, MapPin, Heart, Crown, ArrowLeft } from 'lucide-react';

import { Navigation } from '@/components/Navigation';
import { TopBar } from '@/components/TopBar';


import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type TabType = 'following' | 'subscribed';

interface Worker {
  id: string;
  name: string;
  title: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  isSubscribed?: boolean;
  subscriptionExpiry?: string;
}

export default function FollowingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('following');
  const [sortBy, setSortBy] = useState('recent');
  const navigate = useNavigate();

  const followingWorkers: Worker[] = [
    {
      id: '1',
      name: 'Scarlett Rose',
      title: 'Elite Escort',
      location: 'Sydney, NSW',
      image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762053930617_5c7fadf3.webp',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 450,
    },
    {
      id: '2',
      name: 'Ruby Diamond',
      title: 'Stripper',
      location: 'Melbourne, VIC',
      image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762053931612_1a85d834.webp',
      rating: 4.8,
      reviews: 94,
      hourlyRate: 380,
    },
  ];


  const subscribedWorkers: Worker[] = [
    {
      id: '3',
      name: 'Jade Monroe',
      title: 'Premium Escort',
      location: 'Brisbane, QLD',
      image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762054136047_d93c5aa2.webp',
      rating: 5.0,
      reviews: 156,
      hourlyRate: 520,
      isSubscribed: true,
      subscriptionExpiry: '2025-12-01',
    },
  ];


  const workers = activeTab === 'following' ? followingWorkers : subscribedWorkers;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />
      <TopBar />
      <main className="ml-52 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="icon"
            className="hover:bg-pink-50"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-700" />
          </Button>
          <h1 className="text-3xl font-bold text-zinc-900">Following & Subscriptions</h1>
        </div>


        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab('following')}
              variant={activeTab === 'following' ? 'default' : 'outline'}
              className={activeTab === 'following' ? 'bg-pink-600 hover:bg-pink-700' : ''}
            >
              <Heart className="w-4 h-4 mr-2" />
              Following ({followingWorkers.length})
            </Button>
            <Button
              onClick={() => setActiveTab('subscribed')}
              variant={activeTab === 'subscribed' ? 'default' : 'outline'}
              className={activeTab === 'subscribed' ? 'bg-pink-600 hover:bg-pink-700' : ''}
            >
              <Crown className="w-4 h-4 mr-2" />
              Subscribed ({subscribedWorkers.length})
            </Button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="recent">Recently Added</option>
            <option value="rating">Highest Rated</option>
            <option value="price">Price: Low to High</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <div key={worker.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative h-64">
                <img src={worker.image} alt={worker.name} className="w-full h-full object-cover" />
                {worker.isSubscribed && (
                  <Badge className="absolute top-3 right-3 bg-pink-600">
                    <Crown className="w-3 h-3 mr-1" />
                    Subscribed
                  </Badge>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold text-zinc-900 mb-1">{worker.name}</h3>
                <p className="text-pink-600 font-medium mb-2">{worker.title}</p>

                <div className="flex items-center gap-2 text-sm text-zinc-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{worker.location}</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-zinc-900">{worker.rating}</span>
                    <span className="text-sm text-zinc-500">({worker.reviews})</span>
                  </div>
                  <div className="text-lg font-bold text-pink-600">${worker.hourlyRate}/hr</div>
                </div>

                {worker.subscriptionExpiry && (
                  <p className="text-xs text-zinc-500 mb-3">Expires: {new Date(worker.subscriptionExpiry).toLocaleDateString()}</p>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/messages?user=${worker.id}`)}
                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    onClick={() => navigate(`/bookings?worker=${worker.id}`)}
                    variant="outline"
                    className="flex-1 border-pink-600 text-pink-600 hover:bg-pink-50"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </main>
    </div>

  );
}
