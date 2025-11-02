import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Calendar, DollarSign, Shield, Activity, Ban, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
  onRefresh: () => void;
}

export default function UserDetailsModal({ user, onClose, onRefresh }: UserDetailsModalProps) {
  const { toast } = useToast();

  const handleSuspend = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: !user.is_suspended })
        .eq('id', user.id);
      
      if (error) throw error;
      toast({ title: 'Success', description: `User ${user.is_suspended ? 'unsuspended' : 'suspended'}` });
      onRefresh();
      onClose();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleVerify = async (field: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: !user[field] })
        .eq('id', user.id);
      
      if (error) throw error;
      toast({ title: 'Success', description: 'Verification updated' });
      onRefresh();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-zinc-900 border-pink-500/30 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-pink-400">User Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 border-2 border-pink-500">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-pink-500/20 text-pink-300">{user.full_name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{user.full_name || 'Unknown User'}</h3>
              <p className="text-sm text-gray-400">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge className={user.role === 'worker' ? 'bg-purple-500' : 'bg-blue-500'}>{user.role}</Badge>
                {user.is_verified && <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>}
                {user.is_suspended && <Badge className="bg-red-500"><Ban className="w-3 h-3 mr-1" />Suspended</Badge>}
              </div>
            </div>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-4 bg-zinc-800 border border-pink-500/20">
              <TabsTrigger value="info" className="data-[state=active]:bg-[#FF1493] data-[state=active]:text-white">Info</TabsTrigger>
              <TabsTrigger value="verification" className="data-[state=active]:bg-[#FF1493] data-[state=active]:text-white">Verification</TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-[#FF1493] data-[state=active]:text-white">Financial</TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-[#FF1493] data-[state=active]:text-white">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              <Card className="bg-zinc-800 border-pink-500/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-pink-400" />
                    <span>{user.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-pink-400" />
                    <span>{user.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    <span>{user.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-pink-400" />
                    <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="space-y-4 mt-4">
              <Card className="bg-zinc-800 border-pink-500/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">ID Verification</span>
                    <Button size="sm" onClick={() => handleVerify('id_verified')} className={user.id_verified ? 'bg-green-500' : 'bg-gray-600'}>
                      {user.id_verified ? 'Verified' : 'Not Verified'}
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Background Check</span>
                    <Badge className={user.background_check_status === 'approved' ? 'bg-green-500' : 'bg-gray-600'}>
                      {user.background_check_status || 'Pending'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4 mt-4">
              <Card className="bg-zinc-800 border-pink-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <DollarSign className="w-4 h-4 text-pink-400" />
                    <span>Wallet Balance: ${user.wallet_balance || '0.00'}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-4">
              <Card className="bg-zinc-800 border-pink-500/20">
                <CardContent className="p-4">
                  <p className="text-gray-400">Activity logs coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 justify-end pt-4 border-t border-pink-500/20">
            <Button variant="outline" onClick={onClose} className="bg-zinc-800 border-pink-500/30 text-pink-300">Close</Button>
            <Button onClick={handleSuspend} className={user.is_suspended ? 'bg-green-500' : 'bg-red-500'}>
              {user.is_suspended ? 'Unsuspend' : 'Suspend'} User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
