import React, { useState } from 'react';
import { MapPin, Star, Calendar, DollarSign, Shield, Edit, MoreVertical, Flag, Ban } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import ReviewList from './ReviewList';
import ReviewSubmission from './ReviewSubmission';
import ReportModal from './ReportModal';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';


export const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { toast } = useToast();
  const [reviews, setReviews] = useState([

    {
      id: '1',
      clientName: 'Michael T.',
      clientAvatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761989118512_9d92b0d1.webp',
      rating: 5,
      reviewText: 'Absolutely amazing experience! Professional, punctual, and exceeded all expectations.',
      photos: ['https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761989120352_e3928554.webp'],
      isVerifiedBooking: true,
      createdAt: '2024-10-15T14:30:00Z',
      workerResponse: 'Thank you so much for the kind words! It was a pleasure meeting you.',
      workerResponseDate: '2024-10-16T10:00:00Z'
    },
    {
      id: '2',
      clientName: 'David R.',
      clientAvatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761989122081_ee9321b6.webp',
      rating: 5,
      reviewText: 'Great companion for my business event. Very professional and charming.',
      isVerifiedBooking: true,
      createdAt: '2024-10-10T18:00:00Z'
    },
    {
      id: '3',
      clientName: 'James K.',
      clientAvatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp',
      rating: 4,
      reviewText: 'Wonderful time together. Would definitely book again!',
      isVerifiedBooking: false,
      createdAt: '2024-10-05T20:00:00Z'
    }
  ]);

  const profile = {
    name: 'Sophia Rose',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp',
    coverImage: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915661951_225fc59e.webp',
    type: 'Elite Escort',
    location: 'Melbourne, Victoria',
    rating: 4.9,
    reviews: 127,
    price: 300,
    verified: true,
    joined: 'January 2024',
    bio: 'Sophisticated companion for upscale events and intimate encounters. I specialize in creating unforgettable experiences.',
    services: ['Dinner Dates', 'Overnight', 'Travel Companion', 'Events', 'GFE'],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    gallery: [
      'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915661951_225fc59e.webp',
      'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915663643_a459917b.webp',
      'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915665360_8ece7301.webp',
      'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915672216_a8011d6a.webp',
    ],
  };

  const handleSubmitReview = (review: any) => {
    setReviews(prev => [review, ...prev]);
    setShowReviewForm(false);
  };

  const handleRespondToReview = (reviewId: string, response: string) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId 
        ? { ...r, workerResponse: response, workerResponseDate: new Date().toISOString() }
        : r
    ));
  };

  const handleBlockUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('blocked_users').insert({
      blocker_id: user.id,
      blocked_id: 'worker-id-placeholder',
      reason: 'Blocked from profile'
    });

    if (!error) {
      toast({ title: 'User blocked successfully' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportedUserId="worker-id-placeholder"
        reportedUserName={profile.name}
      />

      <div className="relative">
        <img src={profile.coverImage} alt="Cover" className="w-full h-64 object-cover" />
        <div className="absolute top-4 right-4 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="bg-black/50 border-zinc-700">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowReportModal(true)}>
                <Flag className="w-4 h-4 mr-2" />
                Report User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlockUser} className="text-red-500">
                <Ban className="w-4 h-4 mr-2" />
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setIsEditing(!isEditing)} size="sm" className="bg-pink-500 hover:bg-pink-600">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20">
        <div className="flex items-end gap-6 mb-6">
          <img src={profile.avatar} alt={profile.name} className="w-40 h-40 rounded-full border-4 border-black object-cover" />
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              {profile.verified && <Shield className="w-6 h-6 text-pink-500" />}
            </div>
            <p className="text-zinc-400 mb-2">{profile.type}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</div>
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {profile.rating} ({profile.reviews} reviews)</div>
              <div className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-pink-400" /> ${profile.price}/hr</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6 mt-6">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-xl font-semibold mb-3">About Me</h3>
              <p className="text-zinc-300">{profile.bio}</p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-xl font-semibold mb-3">Services</h3>
              <div className="flex flex-wrap gap-2">
                {profile.services.map((service, i) => (
                  <Badge key={i} className="bg-pink-500/20 text-pink-400 border-pink-500/50">{service}</Badge>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-xl font-semibold mb-3">Availability</h3>
              <div className="flex gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className={`px-4 py-2 rounded-lg ${profile.availability.includes(day) ? 'bg-pink-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              {profile.gallery.map((img, i) => (
                <img key={i} src={img} alt={`Gallery ${i + 1}`} className="w-full h-64 object-cover rounded-xl" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-4">
            {!showReviewForm && (
              <Button onClick={() => setShowReviewForm(true)} className="mb-4 bg-pink-500 hover:bg-pink-600">
                Write a Review
              </Button>
            )}
            
            {showReviewForm && (
              <ReviewSubmission
                workerId="worker-1"
                workerName={profile.name}
                bookingId="booking-123"
                onSubmit={handleSubmitReview}
                onCancel={() => setShowReviewForm(false)}
              />
            )}
            
            <ReviewList
              reviews={reviews}
              isWorker={false}
              onRespond={handleRespondToReview}
            />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};
