import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flag, CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const DEMO_CONTENT = [
  { id: '1', content_id: 'prof_8a3b2c1d', content_type: 'profile', flag_type: 'inappropriate', description: 'Profile contains inappropriate content in bio section', reporter_name: 'Sarah M.', created_at: '2024-11-01T10:30:00Z', source: 'user_report', severity: 'high' },
  { id: '2', content_id: 'photo_9x7y5z3w', content_type: 'photo', flag_type: 'fake', description: 'Photo appears to be stock image, not authentic user photo', reporter_name: 'AI System', created_at: '2024-11-01T09:15:00Z', source: 'ai_detection', severity: 'medium' },
  { id: '3', content_id: 'rev_4k2m8n6p', content_type: 'review', flag_type: 'spam', description: 'Review contains promotional links and spam content', reporter_name: 'John D.', created_at: '2024-10-31T18:45:00Z', source: 'user_report', severity: 'low' },
  { id: '4', content_id: 'prof_7h5j9l2q', content_type: 'profile', flag_type: 'harassment', description: 'User profile contains threatening language', reporter_name: 'Emily R.', created_at: '2024-10-31T15:20:00Z', source: 'user_report', severity: 'high' },
  { id: '5', content_id: 'photo_3v8b1n4m', content_type: 'photo', flag_type: 'inappropriate', description: 'Photo violates community guidelines', reporter_name: 'AI System', created_at: '2024-10-31T12:00:00Z', source: 'ai_detection', severity: 'high' },
];

export default function ContentModeration() {
  const [flaggedContent, setFlaggedContent] = useState<any[]>(DEMO_CONTENT);
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const { toast } = useToast();

  const handleDismiss = (flag: any) => {
    setFlaggedContent(prev => prev.filter(item => item.id !== flag.id));
    toast({ title: 'Success', description: 'Report dismissed successfully' });
  };

  const handleRemove = (flag: any) => {
    setFlaggedContent(prev => prev.filter(item => item.id !== flag.id));
    toast({ title: 'Success', description: 'Content removed and user notified' });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredContent = flaggedContent.filter(item => {
    if (typeFilter !== 'all' && item.content_type !== typeFilter) return false;
    if (severityFilter !== 'all' && item.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Flagged Content</h2>
          <p className="text-zinc-400 text-sm mt-1">{filteredContent.length} items pending review</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="profile">Profiles</SelectItem>
              <SelectItem value="photo">Photos</SelectItem>
              <SelectItem value="review">Reviews</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[140px] bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredContent.map((item) => (
          <Card key={item.id} className="bg-zinc-900 border-zinc-800 hover:border-pink-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${item.severity === 'high' ? 'bg-red-500/10' : item.severity === 'medium' ? 'bg-orange-500/10' : 'bg-yellow-500/10'}`}>
                    <Flag className={`w-5 h-5 ${item.severity === 'high' ? 'text-red-500' : item.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">Content ID: {item.content_id}</p>
                      <Badge className={`${getSeverityColor(item.severity)} text-white text-xs`}>{item.severity.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-zinc-400 capitalize">{item.content_type.replace('_', ' ')}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-pink-500 text-pink-500 capitalize">{item.flag_type}</Badge>
              </div>
              
              <div className="bg-zinc-800 rounded-lg p-4 mb-4 border border-zinc-700">
                <p className="text-sm text-zinc-300">{item.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Reported by: <span className="text-zinc-300">{item.reporter_name}</span></span>
                  <span className="text-zinc-600">•</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleDismiss(item)} variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                    <CheckCircle className="w-4 h-4 mr-1" />Dismiss
                  </Button>
                  <Button onClick={() => handleRemove(item)} size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                    <XCircle className="w-4 h-4 mr-1" />Remove Content
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">All Clear!</h3>
            <p className="text-zinc-400">No flagged content to review at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
