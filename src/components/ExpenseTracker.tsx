import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Receipt, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['Travel', 'Equipment', 'Marketing', 'Software', 'Training', 'Supplies', 'Other'];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    category: '', amount: '', description: '', expenseDate: '', isTaxDeductible: true
  });

  useEffect(() => { loadExpenses(); }, []);

  const loadExpenses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('expenses').select('*').eq('worker_id', user.id).order('expense_date', { ascending: false });
    setExpenses(data || []);
  };

  const addExpense = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('expenses').insert({
      worker_id: user.id,
      category: form.category,
      amount: parseFloat(form.amount),
      description: form.description,
      expense_date: form.expenseDate,
      is_tax_deductible: form.isTaxDeductible,
      status: 'approved'
    });

    setOpen(false);
    setForm({ category: '', amount: '', description: '', expenseDate: '', isTaxDeductible: true });
    loadExpenses();
  };

  const deleteExpense = async (id: string) => {
    await supabase.from('expenses').delete().eq('id', id);
    loadExpenses();
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const taxDeductible = expenses.filter(e => e.is_tax_deductible).reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Expense Tracker</CardTitle>
          <div className="flex gap-4 mt-2 text-sm">
            <span>Total: <strong>${totalExpenses.toFixed(2)}</strong></span>
            <span>Tax Deductible: <strong>${taxDeductible.toFixed(2)}</strong></span>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Expense</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Amount ($)</Label><Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
              <div><Label>Date</Label><Input type="date" value={form.expenseDate} onChange={e => setForm({...form, expenseDate: e.target.value})} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="flex items-center space-x-2">
                <Checkbox checked={form.isTaxDeductible} onCheckedChange={v => setForm({...form, isTaxDeductible: !!v})} />
                <Label>Tax Deductible</Label>
              </div>
              <Button onClick={addExpense} className="w-full">Add Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Category</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead>Tax Deductible</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {expenses.map(exp => (
              <TableRow key={exp.id}>
                <TableCell>{new Date(exp.expense_date).toLocaleDateString()}</TableCell>
                <TableCell><Badge variant="outline">{exp.category}</Badge></TableCell>
                <TableCell>{exp.description}</TableCell>
                <TableCell className="font-medium">${exp.amount?.toFixed(2)}</TableCell>
                <TableCell>{exp.is_tax_deductible ? '✓' : '—'}</TableCell>
                <TableCell><Button size="sm" variant="ghost" onClick={() => deleteExpense(exp.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
