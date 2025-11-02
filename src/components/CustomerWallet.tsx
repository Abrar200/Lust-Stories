import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, CreditCard, Plus, Trash2, Search, Wallet, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PaymentMethodModal from './PaymentMethodModal';

export default function CustomerWallet() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true, name: 'John Doe' },
    { id: 2, type: 'Mastercard', last4: '5555', expiry: '08/26', isDefault: false, name: 'John Doe' },
  ]);


  const balance = 450.00;
  const pendingRefunds = 75.00;

  const transactions = [
    { id: 1, date: '2024-10-28', type: 'payment', amount: -150.00, status: 'completed', description: 'Booking with Sarah Johnson' },
    { id: 2, date: '2024-10-25', type: 'refund', amount: 75.00, status: 'completed', description: 'Cancelled booking refund' },
    { id: 3, date: '2024-10-20', type: 'payment', amount: -200.00, status: 'completed', description: 'Booking with Mike Chen' },
    { id: 4, date: '2024-10-15', type: 'payment', amount: -100.00, status: 'completed', description: 'Booking with Emma Davis' },
  ];

  const handleExport = (format: string) => {
    toast({ title: 'Success', description: `Exporting transactions as ${format.toUpperCase()}` });
  };

  const handleRemoveCard = (id: number) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    toast({ title: 'Success', description: 'Payment method removed' });
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods(prev => prev.map(pm => ({ ...pm, isDefault: pm.id === id })));
    toast({ title: 'Success', description: 'Default payment method updated' });
  };

  const handleAddCard = (method: any) => {
    const newId = Math.max(...paymentMethods.map(pm => pm.id), 0) + 1;
    const newMethod = { ...method, id: newId };
    
    if (method.isDefault) {
      setPaymentMethods(prev => [...prev.map(pm => ({ ...pm, isDefault: false })), newMethod]);
    } else {
      setPaymentMethods(prev => [...prev, newMethod]);
    }
    
    toast({ title: 'Success', description: 'Payment method added successfully' });
  };


  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Wallet</h1>
        <p className="text-gray-600 mt-1">Manage your payments and transactions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-pink-100 bg-gradient-to-br from-pink-50 to-rose-50">
          <CardHeader><CardTitle className="text-pink-700">Available Balance</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-pink-600">${balance.toFixed(2)}</p></CardContent>
        </Card>
        <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader><CardTitle className="text-orange-700">Pending Refunds</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-orange-600">${pendingRefunds.toFixed(2)}</p></CardContent>
        </Card>
        <Card className="border-pink-100 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 dark:border-pink-900">
          <CardHeader><CardTitle className="text-pink-700 dark:text-pink-300">Total Spent</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-pink-600 dark:text-pink-400">$450.00</p></CardContent>
        </Card>
      </div>

      <Card className="border-pink-100">
        <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-pink-600" />Payment Methods</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map(pm => (
              <div key={pm.id} className="flex items-center justify-between p-4 border border-pink-100 rounded-lg hover:bg-pink-50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <CreditCard className="w-5 h-5 text-pink-600" />
                  <div className="flex-1">
                    <p className="font-medium">{pm.type} •••• {pm.last4}</p>
                    <p className="text-sm text-gray-500">Expires {pm.expiry} • {pm.name}</p>
                  </div>
                  {pm.isDefault && <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">Default</Badge>}
                  {!pm.isDefault && (
                    <Button variant="ghost" size="sm" onClick={() => handleSetDefault(pm.id)} className="text-pink-600 hover:text-pink-700">
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveCard(pm.id)} className="hover:text-red-600 ml-2">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full border-pink-300 text-pink-600 hover:bg-pink-50" onClick={() => setShowAddCard(true)}>
              <Plus className="w-4 h-4 mr-2" />Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      <PaymentMethodModal open={showAddCard} onClose={() => setShowAddCard(false)} onAdd={handleAddCard} />

      <Card className="border-pink-100">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')} className="border-pink-200 text-pink-600 hover:bg-pink-50"><Download className="w-4 h-4 mr-2" />CSV</Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} className="border-pink-200 text-pink-600 hover:bg-pink-50"><Download className="w-4 h-4 mr-2" />PDF</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-pink-200 focus:border-pink-400" />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 border-pink-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {filteredTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 border border-pink-100 rounded-lg hover:bg-pink-50 transition-colors">
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-sm text-gray-500">{t.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${t.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                    </p>
                    <Badge variant={t.status === 'completed' ? 'default' : 'secondary'} className="bg-pink-100 text-pink-700">{t.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
