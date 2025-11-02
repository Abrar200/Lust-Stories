import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, DollarSign, Eye, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DEMO_CONTENT = [
  { id: '1', worker: 'Sophia', type: 'photo', title: 'Beach Photoshoot', price: 29.99, unlocks: 156, status: 'approved', revenue: 4678.44, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1730543956652_d9b8d03f.png' },
  { id: '2', worker: 'Sophia', type: 'video', title: 'Behind the Scenes', price: 49.99, unlocks: 89, status: 'approved', revenue: 4449.11, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1730543956652_d9b8d03f.png' },
  { id: '3', worker: 'Sophia', type: 'photo', title: 'Private Session', price: 99.99, unlocks: 45, status: 'pending', revenue: 4499.55, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1730543956652_d9b8d03f.png' },
  { id: '4', worker: 'Emma', type: 'video', title: 'Exclusive Interview', price: 19.99, unlocks: 234, status: 'approved', revenue: 4677.66, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1730543956652_d9b8d03f.png' },
];

export default function ExclusiveContentManagement() {
  const [content, setContent] = useState(DEMO_CONTENT);
  const { toast } = useToast();

  const approveContent = (id: string) => {
    setContent(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    toast({ title: 'Success', description: 'Content approved and published' });
  };

  const rejectContent = (id: string) => {
    setContent(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Success', description: 'Content rejected and removed' });
  };

  const totalRevenue = content.reduce((sum, c) => sum + c.revenue, 0);
  const totalUnlocks = content.reduce((sum, c) => sum + c.unlocks, 0);

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-pink-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total Content</p>
                <p className="text-3xl font-bold text-white">{content.length}</p>
              </div>
              <Lock className="w-10 h-10 text-pink-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-pink-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total Revenue</p>
                <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-pink-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total Unlocks</p>
                <p className="text-3xl font-bold text-white">{totalUnlocks}</p>
              </div>
              <Unlock className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Exclusive Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {content.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-zinc-400">{item.worker} • {item.type}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-zinc-400">${item.price}</span>
                    <span className="text-sm text-zinc-400">{item.unlocks} unlocks</span>
                    <span className="text-sm text-green-400">${item.revenue.toFixed(2)} revenue</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={item.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}>{item.status}</Badge>
                  {item.status === 'pending' && (
                    <>
                      <Button onClick={() => approveContent(item.id)} size="sm" className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => rejectContent(item.id)} size="sm" variant="destructive">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}