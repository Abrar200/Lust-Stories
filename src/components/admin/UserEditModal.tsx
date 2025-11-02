import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface UserEditModalProps {
  user: any;
  onClose: () => void;
  onRefresh: () => void;
}

export default function UserEditModal({ user, onClose, onRefresh }: UserEditModalProps) {
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    role: user.role || 'customer',
    wallet_balance: user.wallet_balance || 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({ title: 'Success', description: 'User updated successfully' });
      onRefresh();
      onClose();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-pink-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-pink-400">Edit User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-gray-300">Full Name</Label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="bg-zinc-800 border-pink-500/30 text-white"
            />
          </div>

          <div>
            <Label className="text-gray-300">Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-zinc-800 border-pink-500/30 text-white"
            />
          </div>

          <div>
            <Label className="text-gray-300">Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-zinc-800 border-pink-500/30 text-white"
            />
          </div>

          <div>
            <Label className="text-gray-300">Location</Label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-zinc-800 border-pink-500/30 text-white"
            />
          </div>

          <div>
            <Label className="text-gray-300">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="bg-zinc-800 border-pink-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-pink-500/30">
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="worker">Worker</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Wallet Balance</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.wallet_balance}
              onChange={(e) => setFormData({ ...formData, wallet_balance: parseFloat(e.target.value) })}
              className="bg-zinc-800 border-pink-500/30 text-white"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="bg-zinc-800 border-pink-500/30 text-pink-300">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#FF1493] hover:bg-[#FF1493]/90">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
