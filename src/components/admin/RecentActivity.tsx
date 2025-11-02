import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function RecentActivity() {
  const activities = [
    { user: 'Sarah Johnson', action: 'New booking', time: '2 min ago', type: 'booking', avatar: 'SJ' },
    { user: 'Mike Chen', action: 'Profile verified', time: '15 min ago', type: 'verification', avatar: 'MC' },
    { user: 'Emma Wilson', action: 'Payment received', time: '1 hour ago', type: 'payment', avatar: 'EW' },
    { user: 'David Brown', action: 'Review submitted', time: '2 hours ago', type: 'review', avatar: 'DB' },
    { user: 'Lisa Anderson', action: 'New registration', time: '3 hours ago', type: 'registration', avatar: 'LA' },
  ];

  const getTypeBadge = (type: string) => {
    const badges = {
      booking: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      verification: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      payment: 'bg-pink-600/20 text-pink-400 border-pink-600/30',
      review: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
      registration: 'bg-pink-400/20 text-pink-300 border-pink-400/30',
    };
    return badges[type as keyof typeof badges] || 'bg-zinc-700 text-zinc-300';
  };

  return (
    <Card className="bg-zinc-900 border-pink-500/30">
      <CardHeader>
        <CardTitle className="text-pink-300">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
              <Avatar className="border-2 border-pink-500/30">
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">{activity.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-pink-100">{activity.user}</p>
                <p className="text-xs text-pink-400">{activity.action}</p>
              </div>
              <div className="text-right">
                <Badge className={getTypeBadge(activity.type)}>{activity.type}</Badge>
                <p className="text-xs text-pink-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

