import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useNavigate } from 'react-router-dom';

const BOOKINGS = [
  { id: '1', client: 'Sarah Johnson', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp', date: '2024-11-02', time: '8:00 PM', duration: '3 hours', location: 'St Kilda, Melbourne', price: 900, status: 'confirmed' },
  { id: '2', client: 'Michael Chen', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915647740_a4a6a2c4.webp', date: '2024-11-05', time: '7:00 PM', duration: '2 hours', location: 'Southbank, Melbourne', price: 700, status: 'pending' },
  { id: '3', client: 'Emma Wilson', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915635794_c2084770.webp', date: '2024-10-28', time: '6:00 PM', duration: '4 hours', location: 'Docklands, Melbourne', price: 1200, status: 'completed' },
];

export const WorkerBookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  const filterBookings = (status: string) => {
    if (status === 'upcoming') return BOOKINGS.filter(b => b.status === 'confirmed' || b.status === 'pending');
    if (status === 'past') return BOOKINGS.filter(b => b.status === 'completed');
    return BOOKINGS;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">My Bookings</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          {['upcoming', 'past'].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {filterBookings(tab).map(booking => (
                <Card key={booking.id} className="bg-zinc-900 border-zinc-800 p-6">
                  <div className="flex gap-4">
                    <img src={booking.avatar} alt={booking.client} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold">{booking.client}</h3>
                          <Badge className={booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-pink-400">${booking.price}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-zinc-400 mb-4">
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{booking.date}</div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{booking.time}</div>
                        <div className="col-span-2 flex items-center gap-2"><MapPin className="w-4 h-4" />{booking.location}</div>
                      </div>
                      <Button size="sm" variant="outline" className="border-pink-500 text-pink-400" onClick={() => navigate('/messages')}>
                        Message Client
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
