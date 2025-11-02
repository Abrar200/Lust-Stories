import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, DollarSign, Star, TrendingUp, Clock, CheckCircle, XCircle, BarChart3, FileText } from 'lucide-react';

import { useToast } from './ui/use-toast';

const BOOKING_REQUESTS = [
  { id: '1', client: 'Sarah Johnson', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp', date: '2024-11-05', time: '7:00 PM', duration: '3 hours', location: 'South Yarra, Melbourne', price: 900 },
  { id: '2', client: 'Michael Chen', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915647740_a4a6a2c4.webp', date: '2024-11-07', time: '8:00 PM', duration: '2 hours', location: 'CBD, Melbourne', price: 600 },
];

interface WorkerDashboardProps {
  onNavigate?: (page: string) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ onNavigate }) => {

  const [requests, setRequests] = useState(BOOKING_REQUESTS);
  const { toast } = useToast();

  const handleAccept = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    toast({ title: "Booking Accepted", description: "Client has been notified" });
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    toast({ title: "Booking Declined", description: "Client has been notified" });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">Worker Dashboard</h1>
          <div className="flex gap-2">
            {onNavigate && (
              <>
                <Button onClick={() => onNavigate('calendar')} className="bg-purple-600 hover:bg-purple-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
                <Button onClick={() => onNavigate('analytics')} className="bg-pink-600 hover:bg-pink-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button onClick={() => onNavigate('financial')} className="bg-green-600 hover:bg-green-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Financial Reports
                </Button>
              </>
            )}
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold text-pink-400">$12,450</p>
              </div>
              <DollarSign className="w-10 h-10 text-pink-400" />
            </div>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">This Month</p>
                <p className="text-3xl font-bold text-green-400">$3,200</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-400" />
            </div>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Rating</p>
                <p className="text-3xl font-bold text-yellow-400">4.9</p>
              </div>
              <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
            </div>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Bookings</p>
                <p className="text-3xl font-bold text-purple-400">47</p>
              </div>
              <Calendar className="w-10 h-10 text-purple-400" />
            </div>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-pink-400">Booking Requests</h2>
        <div className="space-y-4">
          {requests.map(req => (
            <Card key={req.id} className="bg-zinc-900 border-zinc-800 p-6">
              <div className="flex gap-4">
                <img src={req.avatar} alt={req.client} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold">{req.client}</h3>
                      <Badge className="bg-yellow-500/20 text-yellow-400 mt-1">Pending</Badge>
                    </div>
                    <p className="text-2xl font-bold text-pink-400">${req.price}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-zinc-400 mb-4">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{req.date}</div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{req.time}</div>
                    <div className="col-span-2">Duration: {req.duration} • {req.location}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleAccept(req.id)} className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />Accept
                    </Button>
                    <Button onClick={() => handleReject(req.id)} variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                      <XCircle className="w-4 h-4 mr-2" />Decline
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
