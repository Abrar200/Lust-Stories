import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertCircle, UserX, Search, Shield, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface BlockedUser {
  id: string;
  blocked_id: string;
  reason: string;
  created_at: string;
  blocked_profile?: {
    full_name: string;
    avatar_url: string;
  };
}

// Demo data
const demoBlockedUsers: BlockedUser[] = [
  {
    id: '1',
    blocked_id: 'user1',
    reason: 'Inappropriate messages',
    created_at: '2024-10-15T10:30:00Z',
    blocked_profile: { full_name: 'Sarah Johnson', avatar_url: '' }
  },
  {
    id: '2',
    blocked_id: 'user2',
    reason: 'Spam content',
    created_at: '2024-10-20T14:20:00Z',
    blocked_profile: { full_name: 'Mike Davis', avatar_url: '' }
  },
  {
    id: '3',
    blocked_id: 'user3',
    reason: 'Harassment',
    created_at: '2024-10-25T09:15:00Z',
    blocked_profile: { full_name: 'Emma Wilson', avatar_url: '' }
  }
];

export default function BlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [unblockId, setUnblockId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading demo data
    setTimeout(() => {
      setBlockedUsers(demoBlockedUsers);
      setFilteredUsers(demoBlockedUsers);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = blockedUsers.filter(user =>
        user.blocked_profile?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(blockedUsers);
    }
  }, [searchQuery, blockedUsers]);

  const handleUnblock = async (blockId: string) => {
    setBlockedUsers(blockedUsers.filter(b => b.id !== blockId));
    toast({
      title: 'User unblocked',
      description: 'You can now see their content and they can contact you.',
    });
    setUnblockId(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-pink-100 rounded w-1/4"></div>
          <div className="h-12 bg-pink-100 rounded"></div>
          <div className="h-24 bg-pink-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Blocked Users</h1>
        <p className="text-gray-600 mt-1">Manage users you've blocked from contacting you</p>
      </div>

      {blockedUsers.length > 0 && (
        <Card className="p-4 mb-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-pink-600" />
              <div>
                <p className="font-semibold text-lg text-pink-900">{blockedUsers.length} Blocked User{blockedUsers.length !== 1 ? 's' : ''}</p>
                <p className="text-sm text-pink-700">These users cannot contact you or see your content</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {blockedUsers.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search blocked users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-pink-200 focus:border-pink-400"
            />
          </div>
        </div>
      )}
      
      {filteredUsers.length === 0 && blockedUsers.length > 0 ? (
        <Alert className="border-pink-200 bg-pink-50">
          <AlertCircle className="h-4 w-4 text-pink-600" />
          <AlertDescription className="text-pink-900">
            No users found matching "{searchQuery}"
          </AlertDescription>
        </Alert>
      ) : filteredUsers.length === 0 ? (
        <Card className="p-12 text-center border-pink-100">
          <UserX className="h-16 w-16 mx-auto text-pink-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Blocked Users</h3>
          <p className="text-gray-600 mb-4">You haven't blocked anyone yet.</p>
          <p className="text-sm text-gray-500">When you block someone, they won't be able to contact you or see your content.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((blocked) => (
            <Card key={blocked.id} className="p-4 hover:shadow-md transition-shadow border-pink-100 hover:border-pink-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-pink-200">
                    <AvatarImage src={blocked.blocked_profile?.avatar_url} />
                    <AvatarFallback className="bg-pink-100">
                      <UserX className="h-6 w-6 text-pink-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {blocked.blocked_profile?.full_name || 'Unknown User'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="destructive" className="text-xs bg-red-100 text-red-700">Blocked</Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(blocked.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    {blocked.reason && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Reason:</span> {blocked.reason}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setUnblockId(blocked.id)}
                  className="hover:bg-pink-50 hover:text-pink-700 hover:border-pink-300 border-pink-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Unblock
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!unblockId} onOpenChange={() => setUnblockId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This user will be able to see your content and contact you again. You can always block them again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => unblockId && handleUnblock(unblockId)} className="bg-pink-600 hover:bg-pink-700">
              Unblock User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
