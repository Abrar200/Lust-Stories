import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';
import { Calendar, Clock, DollarSign, MapPin } from 'lucide-react';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  workerName: string;
  workerAvatar: string;
  services: string[];
  hourlyRate: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({ open, onClose, workerName, workerAvatar, services, hourlyRate }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const calculateTotal = () => {
    const hours = duration ? parseInt(duration.split(' ')[0]) : 0;
    return hours * hourlyRate;
  };

  const handleSubmit = () => {
    if (!date || !time || !duration || !service || !location) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    toast({ title: 'Booking Request Sent!', description: `Your booking with ${workerName} has been submitted.` });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border-pink-200 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Book Appointment</DialogTitle>
          <DialogDescription className="text-zinc-600">Fill out the details below to request a booking</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <img src={workerAvatar} alt={workerName} className="w-16 h-16 rounded-full object-cover border-2 border-pink-300" />
              <div>
                <h4 className="font-semibold text-pink-600 text-lg">{workerName}</h4>
                <p className="text-sm text-zinc-600 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />${hourlyRate}/hour
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-pink-600">Service *</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger className="border-pink-200">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-pink-600 flex items-center gap-1"><Calendar className="w-4 h-4" />Date *</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-pink-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-pink-600 flex items-center gap-1"><Clock className="w-4 h-4" />Time *</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="border-pink-200"><SelectValue placeholder="Select time" /></SelectTrigger>
                <SelectContent>
                  {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-pink-600">Duration *</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="border-pink-200"><SelectValue placeholder="Select duration" /></SelectTrigger>
              <SelectContent>
                {['1 hour','2 hours','3 hours','4 hours','5 hours','6 hours','Overnight'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-pink-600 flex items-center gap-1"><MapPin className="w-4 h-4" />Location *</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter meeting location" className="border-pink-200" />
          </div>

          <div className="space-y-2">
            <Label className="text-pink-600">Additional Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests or details..." className="border-pink-200 min-h-[80px]" />
          </div>

          {duration && <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-700 font-medium">Estimated Total:</span>
              <span className="text-2xl font-bold text-pink-600">${calculateTotal()}</span>
            </div>
          </div>}

          <div className="flex gap-3 justify-end pt-4 border-t border-pink-200">
            <Button variant="outline" onClick={onClose} className="border-pink-300 text-pink-600 hover:bg-pink-50">Cancel</Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">Submit Booking Request</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
