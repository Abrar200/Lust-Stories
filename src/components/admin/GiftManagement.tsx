import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, DollarSign, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const DEMO_GIFTS = [
  { id: '1', name: 'Red Roses', price: 25, image: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1730544264634_7f0e8e3d.png', enabled: true, purchases: 142 },
  { id: '2', name: 'Champagne', price: 50, image: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1730544264634_e2e4e0d5.png', enabled: true, purchases: 89 },
  { id: '3', name: 'Diamond Ring', price: 500, image: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1730544264634_2c0f7c4f.png', enabled: true, purchases: 23 },
  { id: '4', name: 'Luxury Watch', price: 1000, image: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1730544264634_e9b1afa8.png', enabled: true, purchases: 12 },
];

export default function GiftManagement() {
  const [gifts, setGifts] = useState(DEMO_GIFTS);
  const { toast } = useToast();

  const toggleGift = (id: string) => {
    setGifts(prev => prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
    toast({ title: 'Success', description: 'Gift status updated' });
  };

  const totalRevenue = gifts.reduce((sum, g) => sum + (g.price * g.purchases), 0);

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-pink-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total Gifts</p>
                <p className="text-3xl font-bold text-white">{gifts.length}</p>
              </div>
              <Gift className="w-10 h-10 text-pink-500" />
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
                <p className="text-sm text-zinc-400">Total Purchases</p>
                <p className="text-3xl font-bold text-white">{gifts.reduce((sum, g) => sum + g.purchases, 0)}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Manage Gifts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {gifts.map((gift) => (
              <div key={gift.id} className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                <img src={gift.image} alt={gift.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{gift.name}</h3>
                  <p className="text-sm text-zinc-400">{gift.purchases} purchases</p>
                </div>
                <div className="flex items-center gap-4">
                  <Input 
                    type="number" 
                    value={gift.price} 
                    className="w-24 bg-zinc-900 border-zinc-700 text-white"
                    onChange={(e) => setGifts(prev => prev.map(g => g.id === gift.id ? { ...g, price: Number(e.target.value) } : g))}
                  />
                  <Switch checked={gift.enabled} onCheckedChange={() => toggleGift(gift.id)} />
                  <Badge className={gift.enabled ? 'bg-green-500' : 'bg-red-500'}>{gift.enabled ? 'Active' : 'Disabled'}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}