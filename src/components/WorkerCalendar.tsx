import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Download, Plus, X } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { AvailabilityModal } from './AvailabilityModal';

type ViewMode = 'month' | 'week' | 'day';
type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'blocked';

interface CalendarBooking {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  client?: string;
  price?: number;
}

const MOCK_BOOKINGS: CalendarBooking[] = [
  { id: '1', title: 'Sarah Johnson', date: '2024-11-05', startTime: '19:00', endTime: '22:00', status: 'confirmed', client: 'Sarah Johnson', price: 900 },
  { id: '2', title: 'Michael Chen', date: '2024-11-07', startTime: '20:00', endTime: '22:00', status: 'pending', client: 'Michael Chen', price: 600 },
  { id: '3', title: 'Emma Wilson', date: '2024-11-08', startTime: '18:00', endTime: '21:00', status: 'confirmed', client: 'Emma Wilson', price: 750 },
  { id: '4', title: 'Time Off', date: '2024-11-10', startTime: '00:00', endTime: '23:59', status: 'blocked' },
];

export const WorkerCalendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 1));
  const [bookings, setBookings] = useState<CalendarBooking[]>(MOCK_BOOKINGS);
  const [draggedBooking, setDraggedBooking] = useState<CalendarBooking | null>(null);
  const [showAvailability, setShowAvailability] = useState(false);
  const { toast } = useToast();

  const statusColors = {
    pending: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    confirmed: 'bg-green-500/20 border-green-500 text-green-400',
    completed: 'bg-blue-500/20 border-blue-500 text-blue-400',
    blocked: 'bg-red-500/20 border-red-500 text-red-400'
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const handleDragStart = (booking: CalendarBooking) => {
    setDraggedBooking(booking);
  };

  const handleDrop = (newDate: string) => {
    if (draggedBooking) {
      setBookings(prev => prev.map(b => 
        b.id === draggedBooking.id ? { ...b, date: newDate } : b
      ));
      toast({ title: "Booking Rescheduled", description: `Moved to ${newDate}` });
      setDraggedBooking(null);
    }
  };

  const exportToICal = () => {
    let ical = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Worker Calendar//EN\n';
    bookings.forEach(b => {
      ical += `BEGIN:VEVENT\nUID:${b.id}\nDTSTART:${b.date.replace(/-/g, '')}T${b.startTime.replace(':', '')}00\n`;
      ical += `DTEND:${b.date.replace(/-/g, '')}T${b.endTime.replace(':', '')}00\nSUMMARY:${b.title}\nEND:VEVENT\n`;
    });
    ical += 'END:VCALENDAR';
    const blob = new Blob([ical], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'worker-calendar.ics';
    a.click();
    toast({ title: "Calendar Exported", description: "iCal file downloaded" });
  };

  const renderMonthView = () => {
    const { firstDay, daysInMonth } = getDaysInMonth();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center font-semibold text-zinc-400 py-2">{d}</div>
        ))}
        {days.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const dateStr = `2024-11-${String(day).padStart(2, '0')}`;
          const dayBookings = bookings.filter(b => b.date === dateStr);
          return (
            <div
              key={idx}
              className="min-h-24 bg-zinc-900 border border-zinc-800 rounded p-2"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(dateStr)}
            >
              <div className="text-sm font-semibold mb-1">{day}</div>
              {dayBookings.map(b => (
                <div
                  key={b.id}
                  draggable
                  onDragStart={() => handleDragStart(b)}
                  className={`text-xs p-1 rounded mb-1 cursor-move border ${statusColors[b.status]}`}
                >
                  {b.startTime} {b.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">Calendar</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowAvailability(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />Set Availability
            </Button>
            <Button onClick={exportToICal} variant="outline" className="border-pink-500 text-pink-400">
              <Download className="w-4 h-4 mr-2" />Export iCal
            </Button>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button onClick={() => setViewMode('month')} variant={viewMode === 'month' ? 'default' : 'outline'}>Month</Button>
              <Button onClick={() => setViewMode('week')} variant={viewMode === 'week' ? 'default' : 'outline'}>Week</Button>
              <Button onClick={() => setViewMode('day')} variant={viewMode === 'day' ? 'default' : 'outline'}>Day</Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                <ChevronLeft />
              </Button>
              <span className="text-xl font-semibold">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                <ChevronRight />
              </Button>
            </div>
          </div>
          {renderMonthView()}
        </Card>

        <div className="flex gap-4 text-sm">
          <Badge className={statusColors.pending}>Pending</Badge>
          <Badge className={statusColors.confirmed}>Confirmed</Badge>
          <Badge className={statusColors.completed}>Completed</Badge>
          <Badge className={statusColors.blocked}>Blocked/Time Off</Badge>
        </div>

        <AvailabilityModal open={showAvailability} onClose={() => setShowAvailability(false)} />
      </div>
    </div>
  );
};
