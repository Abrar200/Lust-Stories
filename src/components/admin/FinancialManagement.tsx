import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000, payouts: 38000 },
  { month: 'Feb', revenue: 52000, payouts: 42000 },
  { month: 'Mar', revenue: 48000, payouts: 39000 },
  { month: 'Apr', revenue: 61000, payouts: 51000 },
  { month: 'May', revenue: 55000, payouts: 45000 },
  { month: 'Jun', revenue: 67000, payouts: 56000 },
  { month: 'Jul', revenue: 72000, payouts: 60000 },
  { month: 'Aug', revenue: 68000, payouts: 57000 },
  { month: 'Sep', revenue: 75000, payouts: 62000 },
  { month: 'Oct', revenue: 82000, payouts: 68000 },
  { month: 'Nov', revenue: 90000, payouts: 75000 },
];

const chartConfig = {
  revenue: { label: 'Revenue', color: '#ec4899' },
  payouts: { label: 'Payouts', color: '#a855f7' },
};

export default function FinancialManagement() {
  const transactions = [
    { id: 'TXN001', user: 'Sarah Johnson', type: 'Booking', amount: '$250', status: 'Completed', date: '2025-11-01' },
    { id: 'TXN002', user: 'Mike Chen', type: 'Payout', amount: '$1,200', status: 'Pending', date: '2025-11-01' },
    { id: 'TXN003', user: 'Emma Davis', type: 'Refund', amount: '$150', status: 'Processing', date: '2025-10-31' },
    { id: 'TXN004', user: 'Alex Kim', type: 'Booking', amount: '$400', status: 'Completed', date: '2025-10-31' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-pink-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-pink-300">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-100">$487,293</div>
            <p className="text-xs text-pink-400">+23% this month</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-pink-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-pink-300">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-100">$24,150</div>
            <p className="text-xs text-pink-400">15 workers</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-pink-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-pink-300">Platform Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-100">$48,729</div>
            <p className="text-xs text-pink-400">10% commission</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-pink-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-pink-300">Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-100">$3,420</div>
            <p className="text-xs text-pink-400">12 this month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-pink-500/30">
        <CardHeader>
          <CardTitle className="text-pink-300">Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ec489920" />
              <XAxis dataKey="month" stroke="#fda4af" />
              <YAxis stroke="#fda4af" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 4 }} />
              <Line type="monotone" dataKey="payouts" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-pink-500/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-pink-300">Recent Transactions</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20">
                <Download className="w-4 h-4 mr-2" />Export
              </Button>
              <Button size="sm" variant="outline" className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-pink-500/30">
                <TableHead className="text-pink-300">ID</TableHead>
                <TableHead className="text-pink-300">User</TableHead>
                <TableHead className="text-pink-300">Type</TableHead>
                <TableHead className="text-pink-300">Amount</TableHead>
                <TableHead className="text-pink-300">Status</TableHead>
                <TableHead className="text-pink-300">Date</TableHead>
                <TableHead className="text-pink-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id} className="border-pink-500/20">
                  <TableCell className="font-mono text-pink-200">{txn.id}</TableCell>
                  <TableCell className="text-pink-100">{txn.user}</TableCell>
                  <TableCell className="text-pink-100">{txn.type}</TableCell>
                  <TableCell className="font-semibold text-pink-100">{txn.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      txn.status === 'Completed' ? 'bg-pink-500/20 text-pink-300' :
                      txn.status === 'Pending' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-pink-400/20 text-pink-300'
                    }`}>{txn.status}</span>
                  </TableCell>
                  <TableCell className="text-pink-200">{txn.date}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="text-pink-300 hover:bg-pink-500/20">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
