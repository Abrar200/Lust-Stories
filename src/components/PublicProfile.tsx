import React, { useState } from 'react';
import { MapPin, Star, DollarSign, Shield, MoreVertical, Flag, Ban, MessageCircle, Calendar, Heart, ThumbsUp, Grid3x3, Image as ImageIcon, Lock, Gift } from 'lucide-react';


import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import ReviewList from './ReviewList';
import ReviewSubmission from './ReviewSubmission';
import ReportModal from './ReportModal';
import { BookingModal } from './BookingModal';
import { ExclusiveContent } from './ExclusiveContent';
import { GiftSection } from './GiftSection';

import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface PublicProfileProps {
  userId?: string;
}

export const PublicProfile: React.FC<PublicProfileProps> = ({ userId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reviews] = useState([
    {
      id: '1',
      clientName: 'Michael T.',
      clientAvatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761989118512_9d92b0d1.webp',
      rating: 5,
      reviewText: 'Absolutely amazing! Professional and exceeded expectations.',
      isVerifiedBooking: true,
      createdAt: '2024-10-15T14:30:00Z',
    }
  ]);

  const servicesList = [
    { id: 1, name: 'Topless Stripping', category: 'STRIPPING', likes: 67, likePercentage: 40, price: 100 },
    { id: 2, name: 'Full Nude Performance', category: 'STRIPPING', likes: 89, likePercentage: 55, price: 150 },
    { id: 3, name: 'Lap Dance', category: 'DANCING', likes: 124, likePercentage: 72, price: 80 },
    { id: 4, name: 'Private Show', category: 'PERFORMANCE', likes: 156, likePercentage: 85, price: 200 },
    { id: 5, name: 'Couples Entertainment', category: 'SPECIAL', likes: 98, likePercentage: 68, price: 250 },
    { id: 6, name: 'Bachelor Party Package', category: 'EVENTS', likes: 143, likePercentage: 79, price: 350 },
  ];

  const posts = [
    { id: 1, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915661951_225fc59e.webp', likes: 234, comments: 45 },
    { id: 2, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915663643_a459917b.webp', likes: 189, comments: 32 },
    { id: 3, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp', likes: 312, comments: 67 },
    { id: 4, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915635794_c2084770.webp', likes: 278, comments: 54 },
    { id: 5, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915647740_a4a6a2c4.webp', likes: 401, comments: 89 },
    { id: 6, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915649538_7c01b0e3.webp', likes: 356, comments: 72 },
  ];

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
    bio: 'Sophisticated companion for upscale events and intimate encounters. I pride myself on providing an unforgettable experience tailored to your desires. Discreet, elegant, and always professional.',
    services: ['Dinner Dates', 'Overnight', 'Travel Companion', 'Events & Parties', 'GFE', 'PSE', 'Couples', 'BDSM', 'Role Play', 'Massage'],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    detailedAvailability: [
      { day: 'Monday', times: '10:00 AM - 11:00 PM', available: true },
      { day: 'Tuesday', times: '12:00 PM - 10:00 PM', available: true },
      { day: 'Wednesday', times: '10:00 AM - 11:00 PM', available: true },
      { day: 'Thursday', times: '2:00 PM - 11:00 PM', available: true },
      { day: 'Friday', times: '10:00 AM - 2:00 AM', available: true },
      { day: 'Saturday', times: 'By Appointment Only', available: false },
      { day: 'Sunday', times: 'Not Available', available: false },
    ],
    responseTime: 'Usually within 1 hour',
    advanceBooking: '24 hours notice preferred',
    gallery: [
      'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915661951_225fc59e.webp',
      'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915663643_a459917b.webp',
      'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp',
      'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915635794_c2084770.webp',
      'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915647740_a4a6a2c4.webp',
      'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915649538_7c01b0e3.webp',
    ],
  };





  const handleBlockUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    toast({ title: 'User blocked' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 pb-20">
      <ReportModal open={showReportModal} onClose={() => setShowReportModal(false)} reportedUserId={userId || 'user'} reportedUserName={profile.name} />
      
      <div className="relative">
        <img src={profile.coverImage} alt="Cover" className="w-full h-64 object-cover" />
        <div className="absolute top-4 right-4 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white/90 border-pink-200 hover:bg-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowReportModal(true)}>
                <Flag className="w-4 h-4 mr-2" />Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlockUser} className="text-rose-600">
                <Ban className="w-4 h-4 mr-2" />Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative">
        <div className="bg-white rounded-2xl shadow-xl border border-pink-200 p-6">
          <div className="flex items-start gap-6">
            <img src={profile.avatar} alt={profile.name} className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg -mt-16" />
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{profile.name}</h1>
                {profile.verified && <Shield className="w-6 h-6 text-pink-500" />}
              </div>
              <p className="text-zinc-600 mb-3 font-medium">{profile.type}</p>
              <div className="flex items-center gap-6 text-sm mb-4">
                <div className="flex items-center gap-1.5 text-zinc-700">
                  <MapPin className="w-4 h-4 text-pink-500" /> 
                  <span className="font-medium">{profile.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-700">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 
                  <span className="font-semibold">{profile.rating}</span>
                  <span className="text-zinc-500">({profile.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-pink-500" /> 
                  <span className="font-bold text-pink-600">${profile.price}/hr</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => navigate('/messages')} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                  <MessageCircle className="w-4 h-4 mr-2" />Message
                </Button>
                <Button onClick={() => setShowBookingModal(true)} variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                  <Calendar className="w-4 h-4 mr-2" />Book
                </Button>
                <Button onClick={() => setIsFollowing(!isFollowing)} variant="outline" className={isFollowing ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-pink-300 text-pink-600 hover:bg-pink-50'}>
                  <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-pink-500' : ''}`} />{isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            </div>
          </div>
        </div>




        <Tabs defaultValue="about" className="w-full">
          <TabsList className="bg-white border border-pink-200">
            <TabsTrigger value="about" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">About</TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <Grid3x3 className="w-4 h-4 mr-2" />Services
            </TabsTrigger>
            <TabsTrigger value="exclusive" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <Lock className="w-4 h-4 mr-2" />Exclusive
            </TabsTrigger>
            <TabsTrigger value="gifts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <Gift className="w-4 h-4 mr-2" />Gifts
            </TabsTrigger>
            <TabsTrigger value="posts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <ImageIcon className="w-4 h-4 mr-2" />Posts
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">Gallery</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">Reviews</TabsTrigger>
          </TabsList>



          <TabsContent value="about" className="space-y-6 mt-6">
            <div className="bg-white p-6 rounded-xl border border-pink-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-pink-600">About Me</h3>
              <p className="text-zinc-700">{profile.bio}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-pink-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-pink-600">Services</h3>
              <div className="flex flex-wrap gap-2">
                {profile.services.map((s, i) => (
                  <Badge key={i} className="bg-pink-100 text-pink-700 border-pink-300">{s}</Badge>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-pink-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-pink-600">Availability Schedule</h3>
              
              <div className="space-y-3 mb-6">
                {profile.detailedAvailability.map((slot, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-lg border-2 ${slot.available ? 'bg-pink-50 border-pink-300' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${slot.available ? 'bg-green-500' : 'bg-zinc-400'}`}></div>
                      <span className="font-semibold text-zinc-800">{slot.day}</span>
                    </div>
                    <span className={`font-medium ${slot.available ? 'text-pink-600' : 'text-zinc-500'}`}>{slot.times}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-pink-200">
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-pink-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-800 text-sm">Advance Booking</p>
                    <p className="text-zinc-600 text-sm">{profile.advanceBooking}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-5 h-5 text-pink-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-800 text-sm">Response Time</p>
                    <p className="text-zinc-600 text-sm">{profile.responseTime}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
                <p className="text-sm text-pink-700">
                  <span className="font-semibold">Note:</span> Weekend bookings require advance notice. Last-minute availability may vary.
                </p>
              </div>
            </div>


          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicesList.map((service) => (
                <div key={service.id} className="bg-white p-6 rounded-xl border-2 border-pink-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <Badge className="bg-pink-100 text-pink-700 border-pink-300 mb-2">{service.category}</Badge>
                    <h3 className="text-lg font-semibold text-zinc-800">{service.name}</h3>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5 text-pink-500" />
                      <span className="text-pink-600 font-semibold">{service.likePercentage}%</span>
                      <span className="text-zinc-500 text-sm">({service.likes})</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-600">From</p>
                      <p className="text-2xl font-bold text-pink-600">${service.price}</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowBookingModal(true)} className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exclusive">
            <ExclusiveContent workerName={profile.name} />
          </TabsContent>

          <TabsContent value="gifts">
            <GiftSection workerName={profile.name} workerId={userId || 'worker'} />
          </TabsContent>

          <TabsContent value="posts" className="mt-6">

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="relative group cursor-pointer">
                  <img src={post.image} alt={`Post ${post.id}`} className="w-full h-64 object-cover rounded-xl border border-pink-200" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-white">
                      <Heart className="w-6 h-6 fill-white" />
                      <span className="font-semibold">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <MessageCircle className="w-6 h-6 fill-white" />
                      <span className="font-semibold">{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              {profile.gallery.map((img, i) => (
                <img key={i} src={img} alt={`Gallery ${i + 1}`} className="w-full h-64 object-cover rounded-xl border border-pink-200" />
              ))}
            </div>
          </TabsContent>


          <TabsContent value="reviews" className="mt-6 space-y-4">
            {!showReviewForm && (
              <Button onClick={() => setShowReviewForm(true)} className="mb-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                Write a Review
              </Button>
            )}
            {showReviewForm && <ReviewSubmission workerId={userId || 'worker'} workerName={profile.name} bookingId="booking" onSubmit={() => setShowReviewForm(false)} onCancel={() => setShowReviewForm(false)} />}
            <ReviewList reviews={reviews} isWorker={false} />
          </TabsContent>
        </Tabs>
      </div>

      <BookingModal 
        open={showBookingModal} 
        onClose={() => setShowBookingModal(false)} 
        workerName={profile.name}
        workerAvatar={profile.avatar}
        services={profile.services}
        hourlyRate={profile.price}
      />
    </div>
  );
};

