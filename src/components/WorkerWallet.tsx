import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, DollarSign, TrendingUp, ArrowDownToLine } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function WorkerWallet() {
  const [wallet, setWallet] = useState({
    available_balance: 0,
    pending_balance: 0,
    total_earned: 0,
    total_withdrawn: 0
  });
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('worker_wallets')
      .select('*')
      .eq('worker_id', user.id)
      .single();

    if (data) setWallet(data);
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount > wallet.available_balance) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('payout_requests').insert({
        worker_id: user?.id,
        amount
      });

      alert('Withdrawal request submitted!');
      setWithdrawAmount('');
      loadWallet();
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.available_balance.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.pending_balance.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.total_earned.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Withdrawn</CardTitle>
            <ArrowDownToLine className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.total_withdrawn.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              max={wallet.available_balance}
            />
            <Button onClick={handleWithdraw} disabled={loading}>
              Withdraw
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Available balance: ${wallet.available_balance.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
