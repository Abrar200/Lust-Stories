import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, XCircle, FileText, Phone, Mail, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function UserVerification() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState<'all' | 'id' | 'background_check'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVerifications();
    const subscription = supabase
      .channel('verifications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_verifications' }, fetchVerifications)
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, [filter]);

  const fetchVerifications = async () => {
    try {
      let query = supabase.from('user_verifications').select('*').eq('status', 'pending');
      if (filter !== 'all') query = query.eq('verification_type', filter);
      const { data, error } = await query.order('submitted_at', { ascending: false });
      if (error) throw error;
      setVerifications(data || []);
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
      moderator_id: user.id, action_type: actionType, target_type: 'user', target_id: targetId, details
    });
  };

  const handleApprove = async (verification: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('user_verifications').update({
        status: 'approved', reviewed_by: user.id, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString()
      }).eq('id', verification.id);
      if (error) throw error;
      await logAction('user_verified', verification.user_id, { verification_type: verification.verification_type });
      toast({ title: 'Success', description: 'Verification approved' });
      fetchVerifications();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleReject = async () => {
    if (!selectedVerification || !rejectionReason.trim()) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('user_verifications').update({
        status: 'rejected', rejection_reason: rejectionReason, reviewed_by: user.id, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString()
      }).eq('id', selectedVerification.id);
      if (error) throw error;
      await logAction('user_verification_rejected', selectedVerification.user_id, { reason: rejectionReason });
      toast({ title: 'Success', description: 'Verification rejected' });
      setShowRejectDialog(false);
      setRejectionReason('');
      fetchVerifications();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getVerificationIcon = (type: string) => {
    switch (type) {
      case 'id': return FileText;
      case 'phone': return Phone;
      case 'email': return Mail;
      case 'address': return MapPin;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Verification Requests ({verifications.length})</h2>
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'id' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('id')}>ID</Button>
          <Button variant={filter === 'background_check' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('background_check')}>Background</Button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : verifications.map((verification) => {
        const Icon = getVerificationIcon(verification.verification_type);
        return (
          <Card key={verification.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold">User ID: {verification.user_id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">{new Date(verification.submitted_at).toLocaleDateString()}</p>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1"><Icon className="w-3 h-3" />{verification.verification_type}</Badge>
              </div>
              {verification.document_url && (
                <div className="bg-gray-50 rounded p-4 mb-4">
                  <Button variant="link" size="sm" onClick={() => window.open(verification.document_url, '_blank')}>View Document</Button>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => handleApprove(verification)} className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />Verify</Button>
                <Button onClick={() => { setSelectedVerification(verification); setShowRejectDialog(true); }} variant="destructive" className="flex items-center gap-2"><XCircle className="w-4 h-4" />Reject</Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Verification</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Enter reason..." rows={4} />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>Reject</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
