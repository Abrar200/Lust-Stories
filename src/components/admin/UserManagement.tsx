import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, UserCheck, UserX, Edit, Trash2, Shield, DollarSign, Eye, Ban, CheckCircle, XCircle, Download, Mail, Phone, MapPin, Calendar, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import UserDetailsModal from './UserDetailsModal';
import UserEditModal from './UserEditModal';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'id' | 'background'>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filter]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id?.includes(searchQuery)
      );
    }

    if (filter === 'id') {
      filtered = filtered.filter(user => user.id_verified === true);
    } else if (filter === 'background') {
      filtered = filtered.filter(user => user.background_check_status === 'approved');
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      toast({ title: 'Success', description: 'User deleted successfully' });
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleQuickSuspend = async (user: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: !user.is_suspended })
        .eq('id', user.id);
      
      if (error) throw error;
      toast({ title: 'Success', description: `User ${user.is_suspended ? 'unsuspended' : 'suspended'}` });
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="pl-10 bg-zinc-900 border-pink-500/30 text-white placeholder:text-gray-500 focus:border-pink-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-[#FF1493] hover:bg-[#FF1493]/90 text-white' : 'bg-zinc-900 border-pink-500/30 text-pink-300 hover:bg-pink-500/20'}
          >
            All ({users.length})
          </Button>
          <Button
            variant={filter === 'id' ? 'default' : 'outline'}
            onClick={() => setFilter('id')}
            className={filter === 'id' ? 'bg-[#FF1493] hover:bg-[#FF1493]/90 text-white' : 'bg-zinc-900 border-pink-500/30 text-pink-300 hover:bg-pink-500/20'}
          >
            ID Verified
          </Button>
          <Button
            variant={filter === 'background' ? 'default' : 'outline'}
            onClick={() => setFilter('background')}
            className={filter === 'background' ? 'bg-[#FF1493] hover:bg-[#FF1493]/90 text-white' : 'bg-zinc-900 border-pink-500/30 text-pink-300 hover:bg-pink-500/20'}
          >
            Background Check
          </Button>
          <Button
            variant="outline"
            className="bg-zinc-900 border-pink-500/30 text-pink-300 hover:bg-pink-500/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading users...</div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="bg-zinc-900 border-pink-500/30 hover:border-pink-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="w-16 h-16 border-2 border-pink-500">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="bg-pink-500/20 text-pink-300 text-lg">
                        {user.full_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{user.full_name || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge className={user.role === 'worker' ? 'bg-purple-500' : user.role === 'admin' ? 'bg-orange-500' : 'bg-blue-500'}>
                          {user.role}
                        </Badge>
                        {user.is_verified && (
                          <Badge className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {user.id_verified && (
                          <Badge className="bg-cyan-500">
                            <Shield className="w-3 h-3 mr-1" />
                            ID Verified
                          </Badge>
                        )}
                        {user.background_check_status === 'approved' && (
                          <Badge className="bg-emerald-500">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Background Check
                          </Badge>
                        )}
                        {user.is_suspended && (
                          <Badge className="bg-red-500">
                            <Ban className="w-3 h-3 mr-1" />
                            Suspended
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-pink-400" />
                            {user.phone}
                          </div>
                        )}
                        {user.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-pink-400" />
                            {user.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-pink-400" />
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-pink-400" />
                          ${user.wallet_balance || '0.00'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => { setSelectedUser(user); setShowDetailsModal(true); }}
                      className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => { setSelectedUser(user); setShowEditModal(true); }}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleQuickSuspend(user)}
                      className={user.is_suspended ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30' : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30'}
                    >
                      <Ban className="w-4 h-4 mr-1" />
                      {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No users found matching your criteria
            </div>
          )}
        </div>
      )}

      {showDetailsModal && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => setShowDetailsModal(false)} onRefresh={fetchUsers} />
      )}
      {showEditModal && selectedUser && (
        <UserEditModal user={selectedUser} onClose={() => setShowEditModal(false)} onRefresh={fetchUsers} />
      )}
    </div>
  );
}

