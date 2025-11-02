import { Navigation } from '@/components/Navigation';
import { TopBar } from '@/components/TopBar';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';


const EventsPage = () => {
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState(true);
  const [event, setEvent] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [travelAllowance, setTravelAllowance] = useState('');
  const [description, setDescription] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const calculateDuration = () => {
    if (!startTime || !endTime) return '0.0h';
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const duration = (endHour * 60 + endMin - startHour * 60 - startMin) / 60;
    return duration > 0 ? `${duration.toFixed(1)}h` : '0.0h';
  };

  const handlePost = async () => {
    // Validation
    if (!event || !service || !state || !address || !date || !startTime || !endTime || !hourlyRate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsPosting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to post an event',
          variant: 'destructive',
        });
        setIsPosting(false);
        return;
      }

      const { error } = await supabase.from('events').insert({
        user_id: user.id,
        is_public: isPublic,
        event_type: event,
        service_type: service,
        state,
        address,
        event_date: format(date, 'yyyy-MM-dd'),
        start_time: startTime,
        end_time: endTime,
        hourly_rate: parseFloat(hourlyRate),
        travel_allowance: travelAllowance ? parseFloat(travelAllowance) : 0,
        description,
      });

      if (error) throw error;

      toast({
        title: 'Event Posted Successfully!',
        description: 'Your event has been published and is now visible to workers.',
      });

      // Reset form
      setEvent('');
      setService('');
      setState('');
      setAddress('');
      setDate(undefined);
      setStartTime('');
      setEndTime('');
      setHourlyRate('');
      setTravelAllowance('');
      setDescription('');
    } catch (error: any) {
      console.error('Error posting event:', error);
      toast({
        title: 'Error Posting Event',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPosting(false);
    }
  };


  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />
      <TopBar />
      <main className="ml-52 pt-16">
        <div className="p-8 flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-lg border border-zinc-200 p-8 shadow-sm">
            <div className="flex gap-2 mb-6 justify-center">
              <Button 
                variant={isPublic ? "default" : "outline"} 
                onClick={() => setIsPublic(true)} 
                className={isPublic ? "px-8 bg-pink-600 hover:bg-pink-700" : "px-8"}
              >
                Public
              </Button>
              <Button 
                variant={!isPublic ? "default" : "outline"} 
                onClick={() => setIsPublic(false)} 
                className={!isPublic ? "px-8 bg-pink-600 hover:bg-pink-700" : "px-8"}
              >
                Private
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-zinc-700 font-medium">Event</Label>
                <RadioGroup value={event} onValueChange={setEvent}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hens" id="hens" className="border-pink-600 text-pink-600" />
                    <Label htmlFor="hens" className="text-zinc-700 cursor-pointer">Hens Night</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bucks" id="bucks" className="border-pink-600 text-pink-600" />
                    <Label htmlFor="bucks" className="text-zinc-700 cursor-pointer">Bucks Night</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" className="border-pink-600 text-pink-600" />
                    <Label htmlFor="private" className="text-zinc-700 cursor-pointer">Private</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-zinc-700 font-medium">Service</Label>
                <RadioGroup value={service} onValueChange={setService}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stripping" id="stripping" className="border-pink-600 text-pink-600" />
                    <Label htmlFor="stripping" className="text-zinc-700 cursor-pointer">Stripping (full nude)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="topless" id="topless" className="border-pink-600 text-pink-600" />
                    <Label htmlFor="topless" className="text-zinc-700 cursor-pointer">Topless</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="escorting" id="escorting" className="border-pink-600 text-pink-600" />
                    <Label htmlFor="escorting" className="text-zinc-700 cursor-pointer">Escorting</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-zinc-700">State</label>
                <Input placeholder="Enter state" value={state} onChange={(e) => setState(e.target.value)} />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-zinc-700">Address</label>
                <Input placeholder="Start Typing" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-zinc-700">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-zinc-700">Time</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <Clock className="mr-2 h-4 w-4" />
                      {startTime || 'Start time'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4">
                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="text-lg" />
                  </PopoverContent>
                </Popover>
                <span>To</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 justify-start text-left font-normal">
                      <Clock className="mr-2 h-4 w-4" />
                      {endTime || 'End time'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4">
                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="text-lg" />
                  </PopoverContent>
                </Popover>
                <span className="text-zinc-500 font-medium">{calculateDuration()}</span>
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-zinc-700">Hourly Rate</label>
                <Input type="number" placeholder="$0.00" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="w-32" />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-right text-zinc-700">Travel Allowance</label>
                <Input type="number" placeholder="$0.00" value={travelAllowance} onChange={(e) => setTravelAllowance(e.target.value)} className="w-32" />
                <span>p/km</span>
              </div>

              <div className="flex items-start gap-4">
                <label className="w-32 text-right text-zinc-700 pt-2">Description</label>
                <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="flex-1 min-h-32" />
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handlePost} 
                  disabled={isPosting}
                  className="px-12 bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </Button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;
