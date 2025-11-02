import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useToast } from './ui/use-toast';

interface AvailabilityModalProps {
  open: boolean;
  onClose: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const min = i % 2 === 0 ? '00' : '30';
  const ampm = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${min} ${ampm}`;
});

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ open, onClose }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('5:00 PM');
  const { toast } = useToast();

  const handleSave = () => {
    if (selectedDays.length === 0) {
      toast({ title: "Error", description: "Please select at least one day", variant: "destructive" });
      return;
    }
    toast({ title: "Availability Saved", description: `Set for ${selectedDays.join(', ')}` });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>Set Recurring Availability</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-white mb-2 block">Select Days</Label>
            <div className="space-y-2">
              {DAYS.map(day => (
                <div key={day} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedDays.includes(day)}
                    onCheckedChange={(checked) => {
                      setSelectedDays(prev => checked ? [...prev, day] : prev.filter(d => d !== day));
                    }}
                  />
                  <label className="text-white">{day}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-white">Start Time</Label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                {TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white">End Time</Label>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                {TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700 flex-1">Save</Button>
            <Button onClick={onClose} variant="outline" className="flex-1">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
