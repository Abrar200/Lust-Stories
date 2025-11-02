import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function DisputeResolution() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolution, setResolution] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'payment'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDisputes();
    const subscription = supabase
      .channel('disputes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'disputes' }, fetchDisputes)
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, [filter]);

  const fetchDisputes = async () => {
    try {
      let query = supabase.from('disputes').select('*').in('status', ['open', 'investigating']);
      if (filter === 'high') query = query.eq('priority', 'high');
      if (filter === 'payment') query = query.eq('dispute_type', 'payment');
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      setDisputes(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const logAction = async (actionType: string, targetId: string, details: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('moderation_logs').insert({
      moderator_id: user.id, action_type: actionType, target_type: 'dispute', target_id: targetId, details
    });
  };

  const handleResolve = async () => {
    if (!selectedDispute || !resolution.trim()) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('disputes').update({
        status: 'resolved', resolution, resolved_by: user.id, resolved_at: new Date().toISOString(), updated_at: new Date().toISOString()
      }).eq('id', selectedDispute.id);
      if (error) throw error;
      await logAction('dispute_resolved', selectedDispute.id, { dispute_type: selectedDispute.dispute_type, resolution });
      toast({ title: 'Success', description: 'Dispute resolved successfully' });
      setShowResolveDialog(false);
      setResolution('');
      fetchDisputes();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Active Disputes ({disputes.length})</h2>
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'high' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('high')}>High Priority</Button>
          <Button variant={filter === 'payment' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('payment')}>Payment</Button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : disputes.map((dispute) => (
        <Card key={dispute.id} className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold">Dispute ID: {dispute.id.slice(0, 8)}</p>
                <p className="text-xs text-gray-600">Complainant: {dispute.complainant_id.slice(0, 8)}</p>
                <p className="text-xs text-gray-600">Respondent: {dispute.respondent_id.slice(0, 8)}</p>
              </div>
              <div className="flex gap-2">
                <Badge className={`${getPriorityColor(dispute.priority)} text-white`}>{dispute.priority}</Badge>
                <Badge variant="outline">{dispute.dispute_type}</Badge>
              </div>
            </div>
            <div className="bg-white rounded p-4 mb-4">
              <p className="text-sm text-gray-700">{dispute.description}</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => { setSelectedDispute(dispute); setShowResolveDialog(true); }} className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />Resolve</Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Resolve Dispute</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Textarea value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="Describe the resolution..." rows={5} />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowResolveDialog(false)}>Cancel</Button>
              <Button onClick={handleResolve} disabled={!resolution.trim()}>Submit Resolution</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
