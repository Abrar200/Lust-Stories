import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Send, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function InvoiceGenerator() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    clientName: '', clientEmail: '', amount: '', description: '', dueDate: ''
  });

  useEffect(() => { loadInvoices(); }, []);

  const loadInvoices = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('invoices').select('*').eq('worker_id', user.id).order('created_at', { ascending: false });
    setInvoices(data || []);
  };

  const createInvoice = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const invoiceNumber = `INV-${Date.now()}`;
    const amount = parseFloat(form.amount);
    const taxAmount = amount * 0.1;
    const totalAmount = amount + taxAmount;

    await supabase.from('invoices').insert({
      worker_id: user.id,
      invoice_number: invoiceNumber,
      client_name: form.clientName,
      client_email: form.clientEmail,
      amount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      status: 'draft',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: form.dueDate,
      description: form.description
    });

    setOpen(false);
    setForm({ clientName: '', clientEmail: '', amount: '', description: '', dueDate: '' });
    loadInvoices();
  };

  const downloadInvoice = async (invoice: any) => {
    const { data } = await supabase.functions.invoke('generate-invoice-pdf', {
      body: { invoice }
    });
    if (data?.url) window.open(data.url, '_blank');
  };

  const sendInvoice = async (id: string) => {
    await supabase.from('invoices').update({ status: 'sent' }).eq('id', id);
    loadInvoices();
  };

  const getStatusColor = (status: string) => {
    const colors: any = { draft: 'secondary', sent: 'default', paid: 'default', overdue: 'destructive' };
    return colors[status] || 'secondary';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoices</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Create Invoice</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Invoice</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Client Name</Label><Input value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} /></div>
              <div><Label>Client Email</Label><Input type="email" value={form.clientEmail} onChange={e => setForm({...form, clientEmail: e.target.value})} /></div>
              <div><Label>Amount ($)</Label><Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
              <div><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <Button onClick={createInvoice} className="w-full">Create Invoice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Invoice #</TableHead><TableHead>Client</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {invoices.map(inv => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.invoice_number}</TableCell>
                <TableCell>{inv.client_name}</TableCell>
                <TableCell>${inv.total_amount?.toFixed(2)}</TableCell>
                <TableCell><Badge variant={getStatusColor(inv.status)}>{inv.status}</Badge></TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => downloadInvoice(inv)}><Download className="w-3 h-3" /></Button>
                  {inv.status === 'draft' && <Button size="sm" onClick={() => sendInvoice(inv.id)}><Send className="w-3 h-3" /></Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
