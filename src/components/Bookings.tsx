import React, { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ReviewSubmission from './ReviewSubmission';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


const BOOKINGS = [
  { id: '1', name: 'Sophia Rose', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp', date: '2024-11-02', time: '8:00 PM', duration: '3 hours', location: 'South Yarra, Melbourne', price: 900, status: 'confirmed' },
  { id: '2', name: 'Marcus Steel', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915647740_a4a6a2c4.webp', date: '2024-11-05', time: '7:00 PM', duration: '2 hours', location: 'Sydney CBD', price: 700, status: 'pending' },
  { id: '3', name: 'Isabella Luna', avatar: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915635794_c2084770.webp', date: '2024-10-28', time: '6:00 PM', duration: '4 hours', location: 'Surfers Paradise, Gold Coast', price: 1000, status: 'completed' },
];

export const Bookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [reviewBooking, setReviewBooking] = useState<any>(null);
  const [rescheduleBooking, setRescheduleBooking] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();


  const getStatusIcon = (status: string) => {
    if (status === 'confirmed') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'pending') return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-blue-500" />;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      confirmed: 'bg-green-500/20 text-green-400 border-green-500/50',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      completed: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  const filterBookings = (status: string) => {
    if (status === 'upcoming') return BOOKINGS.filter(b => b.status === 'confirmed' || b.status === 'pending');
    if (status === 'past') return BOOKINGS.filter(b => b.status === 'completed');
    return BOOKINGS;
  };

  const handleMessage = (booking: any) => {
    navigate('/messages');
  };

  const handleReschedule = (booking: any) => {
    setRescheduleBooking(booking);
    setNewDate(booking.date);
    setNewTime(booking.time);
    setDuration(booking.duration);
    setReason('');
  };


  const submitReschedule = () => {
    toast({
      title: "Reschedule Request Sent",
      description: `Your request to reschedule with ${rescheduleBooking.name} has been sent.`,
    });
    setRescheduleBooking(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">My Bookings</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          {['upcoming', 'past', 'all'].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {filterBookings(tab).map(booking => (
                <Card key={booking.id} className="bg-zinc-900 border-zinc-800 p-6">
                  <div className="flex gap-4">
                    <img src={booking.avatar} alt={booking.name} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{booking.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(booking.status)}
                            {getStatusBadge(booking.status)}
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-pink-400">${booking.price}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {booking.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {booking.time} ({booking.duration})
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <MapPin className="w-4 h-4" />
                          {booking.location}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {booking.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-pink-500 hover:bg-pink-600">Confirm</Button>
                            <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-400">Cancel</Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-pink-500 text-pink-400"
                              onClick={() => handleMessage(booking)}
                            >
                              Message
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-zinc-700 text-zinc-400"
                              onClick={() => handleReschedule(booking)}
                            >
                              Reschedule
                            </Button>
                          </>
                        )}
                        {booking.status === 'completed' && (
                          <Button 
                            size="sm" 
                            className="bg-pink-500 hover:bg-pink-600"
                            onClick={() => setReviewBooking(booking)}
                          >
                            Leave Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={!!reviewBooking} onOpenChange={() => setReviewBooking(null)}>
          <DialogContent className="bg-zinc-900 text-white border-zinc-800 max-w-2xl">
            {reviewBooking && (
              <ReviewSubmission
                workerId={reviewBooking.id}
                workerName={reviewBooking.name}
                bookingId={reviewBooking.id}
                onSubmit={(review) => {
                  console.log('Review submitted:', review);
                  setReviewBooking(null);
                }}
                onCancel={() => setReviewBooking(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!rescheduleBooking} onOpenChange={() => setRescheduleBooking(null)}>
          <DialogContent className="bg-zinc-900 text-white border-zinc-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-pink-400">Reschedule Booking</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Request a new date and time for your booking
              </DialogDescription>
            </DialogHeader>
            {rescheduleBooking && (
              <div className="space-y-6">
                {/* Booking Info Card */}
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={rescheduleBooking.avatar} alt={rescheduleBooking.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-semibold text-pink-400">{rescheduleBooking.name}</h4>
                      <p className="text-sm text-zinc-400">{rescheduleBooking.location}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-zinc-400">Current Date:</div>
                    <div className="text-white font-medium">{rescheduleBooking.date}</div>
                    <div className="text-zinc-400">Current Time:</div>
                    <div className="text-white font-medium">{rescheduleBooking.time}</div>
                    <div className="text-zinc-400">Duration:</div>
                    <div className="text-white font-medium">{rescheduleBooking.duration}</div>
                    <div className="text-zinc-400">Price:</div>
                    <div className="text-pink-400 font-bold">${rescheduleBooking.price}</div>
                  </div>
                </div>

                {/* New Date & Time */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-pink-400">New Booking Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newDate" className="text-pink-400">Date</Label>
                      <Input
                        id="newDate"
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newTime" className="text-pink-400">Time</Label>
                      <Select value={newTime} onValueChange={setNewTime}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Select time" className="text-white" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectItem value="9:00 AM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">9:00 AM</SelectItem>
                          <SelectItem value="9:30 AM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">9:30 AM</SelectItem>
                          <SelectItem value="10:00 AM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">10:00 AM</SelectItem>
                          <SelectItem value="10:30 AM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">10:30 AM</SelectItem>
                          <SelectItem value="11:00 AM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">11:00 AM</SelectItem>
                          <SelectItem value="11:30 AM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">11:30 AM</SelectItem>
                          <SelectItem value="12:00 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">12:00 PM</SelectItem>
                          <SelectItem value="12:30 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">12:30 PM</SelectItem>
                          <SelectItem value="1:00 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">1:00 PM</SelectItem>
                          <SelectItem value="1:30 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">1:30 PM</SelectItem>
                          <SelectItem value="2:00 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">2:00 PM</SelectItem>
                          <SelectItem value="2:30 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">2:30 PM</SelectItem>
                          <SelectItem value="3:00 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">3:00 PM</SelectItem>
                          <SelectItem value="3:30 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">3:30 PM</SelectItem>
                          <SelectItem value="4:00 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">4:00 PM</SelectItem>
                          <SelectItem value="4:30 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">4:30 PM</SelectItem>
                          <SelectItem value="5:00 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">5:00 PM</SelectItem>
                          <SelectItem value="5:30 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">5:30 PM</SelectItem>
                          <SelectItem value="6:00 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">6:00 PM</SelectItem>
                          <SelectItem value="6:30 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">6:30 PM</SelectItem>
                          <SelectItem value="7:00 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">7:00 PM</SelectItem>
                          <SelectItem value="7:30 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">7:30 PM</SelectItem>
                          <SelectItem value="8:00 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">8:00 PM</SelectItem>
                          <SelectItem value="8:30 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">8:30 PM</SelectItem>
                          <SelectItem value="9:00 PM" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">9:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-pink-400">Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select duration" className="text-white" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="1 hour" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">1 hour</SelectItem>
                        <SelectItem value="2 hours" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">2 hours</SelectItem>
                        <SelectItem value="3 hours" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">3 hours</SelectItem>
                        <SelectItem value="4 hours" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">4 hours</SelectItem>
                        <SelectItem value="5 hours" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">5 hours</SelectItem>
                        <SelectItem value="6 hours" className="text-white hover:bg-zinc-700 focus:bg-zinc-700 focus:text-white">6 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-pink-400">Reason for Rescheduling (Optional)</Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Let them know why you need to reschedule..."
                      className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800">
                  <Button 
                    variant="outline" 
                    onClick={() => setRescheduleBooking(null)}
                    className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold" 
                    onClick={submitReschedule}
                  >
                    Send Reschedule Request
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};
