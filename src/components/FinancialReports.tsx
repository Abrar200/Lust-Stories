import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, DollarSign, TrendingUp, Receipt, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import InvoiceGenerator from './InvoiceGenerator';
import ExpenseTracker from './ExpenseTracker';

export default function FinancialReports() {
  const [period, setPeriod] = useState('month');
  const [earnings, setEarnings] = useState({ total: 0, bookings: 0, avg: 0 });
  const [expenses, setExpenses] = useState({ total: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFinancialData();
  }, [period]);

  const loadFinancialData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    let startDate = new Date();
    
    if (period === 'week') startDate.setDate(now.getDate() - 7);
    else if (period === 'month') startDate.setMonth(now.getMonth() - 1);
    else if (period === 'quarter') startDate.setMonth(now.getMonth() - 3);
    else if (period === 'year') startDate.setFullYear(now.getFullYear() - 1);

    const { data: bookings } = await supabase
      .from('bookings')
      .select('price')
      .eq('worker_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString());

    const total = bookings?.reduce((sum, b) => sum + (b.price || 0), 0) || 0;
    setEarnings({ total, bookings: bookings?.length || 0, avg: bookings?.length ? total / bookings.length : 0 });

    const { data: expenseData } = await supabase
      .from('expenses')
      .select('amount')
      .eq('worker_id', user.id)
      .gte('expense_date', startDate.toISOString().split('T')[0]);

    const expTotal = expenseData?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
    setExpenses({ total: expTotal, count: expenseData?.length || 0 });
    setLoading(false);
  };

  const exportPDF = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('export-financial-pdf', {
        body: { period, earnings, expenses }
      });
      
      if (error) throw error;
      
      if (data?.html) {
        // Create a blob and download it
        const blob = new Blob([data.html], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial-report-${period}-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export PDF error:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const exportExcel = async () => {
    try {
      // Get actual booking and expense data
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      let startDate = new Date();
      
      if (period === 'week') startDate.setDate(now.getDate() - 7);
      else if (period === 'month') startDate.setMonth(now.getMonth() - 1);
      else if (period === 'quarter') startDate.setMonth(now.getMonth() - 3);
      else if (period === 'year') startDate.setFullYear(now.getFullYear() - 1);

      const { data: bookings } = await supabase
        .from('bookings')
        .select('price, created_at, customer_id')
        .eq('worker_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString());

      const { data: expenseData } = await supabase
        .from('expenses')
        .select('amount, expense_date, category, description')
        .eq('worker_id', user.id)
        .gte('expense_date', startDate.toISOString().split('T')[0]);

      // Create CSV content
      let csv = `Financial Report - ${period}\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
      csv += `Summary\n`;
      csv += `Total Earnings,$${earnings.total.toFixed(2)}\n`;
      csv += `Total Expenses,$${expenses.total.toFixed(2)}\n`;
      csv += `Net Income,$${(earnings.total - expenses.total).toFixed(2)}\n\n`;
      
      csv += `Bookings\nDate,Amount\n`;
      bookings?.forEach(b => {
        csv += `${new Date(b.created_at).toLocaleDateString()},$${b.price}\n`;
      });
      
      csv += `\nExpenses\nDate,Category,Description,Amount\n`;
      expenseData?.forEach(e => {
        csv += `${new Date(e.expense_date).toLocaleDateString()},${e.category},"${e.description}",$${e.amount}\n`;
      });

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${period}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export Excel error:', error);
      alert('Failed to export Excel. Please try again.');
    }
  };


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportPDF} variant="outline"><Download className="w-4 h-4 mr-2" />PDF</Button>
          <Button onClick={exportExcel} variant="outline"><Download className="w-4 h-4 mr-2" />Excel</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <DollarSign className="w-4 h-4 text-green-600" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">${earnings.total.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{earnings.bookings} completed bookings</p></CardContent>
        </Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <Receipt className="w-4 h-4 text-red-600" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">${expenses.total.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{expenses.count} expenses</p></CardContent>
        </Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          <TrendingUp className="w-4 h-4 text-blue-600" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">${(earnings.total - expenses.total).toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">After expenses</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger></TabsList>
        <TabsContent value="invoices"><InvoiceGenerator /></TabsContent>
        <TabsContent value="expenses"><ExpenseTracker /></TabsContent>
      </Tabs>
    </div>
  );
}
