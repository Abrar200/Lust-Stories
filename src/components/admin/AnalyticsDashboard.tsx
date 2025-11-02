import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Star, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    pendingReviews: 0,
    flaggedContent: 0,
    openDisputes: 0,
    verificationRequests: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMetrics();
    fetchRecentActivity();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchRecentActivity();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const [reviews, flags, disputes, verifications] = await Promise.all([
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('content_flags').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('disputes').select('id', { count: 'exact', head: true }).in('status', ['open', 'investigating']),
        supabase.from('user_verifications').select('id', { count: 'exact', head: true }).eq('status', 'pending')
      ]);
      setMetrics({
        totalUsers: 0,
        pendingReviews: reviews.count || 0,
        flaggedContent: flags.count || 0,
        openDisputes: disputes.count || 0,
        verificationRequests: verifications.count || 0
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('moderation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      setRecentActivity(data || []);
    } catch (error: any) {
      console.error('Error fetching activity:', error);
    }
  };

  const displayMetrics = [
    { title: 'Pending Reviews', value: metrics.pendingReviews, icon: AlertCircle, color: 'text-pink-600' },
    { title: 'Flagged Content', value: metrics.flaggedContent, icon: AlertCircle, color: 'text-pink-600' },
    { title: 'Open Disputes', value: metrics.openDisputes, icon: TrendingUp, color: 'text-pink-600' },
    { title: 'Verification Requests', value: metrics.verificationRequests, icon: CheckCircle, color: 'text-pink-600' },
  ];


  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600">{metric.title}</p>

                  <p className="text-3xl font-bold mt-2">{metric.value}</p>
                </div>
                <metric.icon className={`w-12 h-12 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Moderation Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-zinc-500">No recent activity</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{activity.action_type.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-zinc-600">{activity.target_type}</p>
                    </div>
                    <span className="text-sm text-zinc-500">{new Date(activity.created_at).toLocaleTimeString()}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader><CardTitle>Moderation Queue</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { item: 'Pending Reviews', count: metrics.pendingReviews, color: 'bg-orange-500' },
                { item: 'Flagged Content', count: metrics.flaggedContent, color: 'bg-red-500' },
                { item: 'Open Disputes', count: metrics.openDisputes, color: 'bg-yellow-500' },
                { item: 'Verification Requests', count: metrics.verificationRequests, color: 'bg-blue-500' },
              ].map((queue) => (
                <div key={queue.item} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${queue.color}`} />
                    <span>{queue.item}</span>
                  </div>
                  <span className="font-bold">{queue.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
