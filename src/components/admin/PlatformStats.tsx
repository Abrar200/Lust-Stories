import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Calendar, TrendingUp, UserCheck, Briefcase } from 'lucide-react';

export default function PlatformStats() {
  const stats = [
    { title: 'Total Users', value: '12,847', change: '+12%', icon: Users, color: 'text-pink-400' },
    { title: 'Active Workers', value: '3,421', change: '+8%', icon: Briefcase, color: 'text-purple-400' },
    { title: 'Total Revenue', value: '$487,293', change: '+23%', icon: DollarSign, color: 'text-pink-500' },
    { title: 'Bookings Today', value: '156', change: '+5%', icon: Calendar, color: 'text-purple-500' },
    { title: 'Verified Users', value: '8,234', change: '+15%', icon: UserCheck, color: 'text-pink-400' },
    { title: 'Growth Rate', value: '18.2%', change: '+3%', icon: TrendingUp, color: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-zinc-900 border-pink-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-pink-300">{stat.title}</CardTitle>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-100">{stat.value}</div>
            <p className="text-xs text-pink-400 mt-1">{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>

  );
}
