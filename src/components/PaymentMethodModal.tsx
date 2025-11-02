import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard } from 'lucide-react';

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (method: any) => void;
}

export default function PaymentMethodModal({ open, onClose, onAdd }: PaymentMethodModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2, 4);
    return v;
  };

  const validate = () => {
    const newErrors: any = {};
    const cardDigits = cardNumber.replace(/\s/g, '');
    if (!cardDigits || cardDigits.length < 13) newErrors.cardNumber = 'Invalid card number';
    if (!expiry || expiry.length !== 5) newErrors.expiry = 'Invalid expiry (MM/YY)';
    if (!cvc || cvc.length < 3) newErrors.cvc = 'Invalid CVC';
    if (!name.trim()) newErrors.name = 'Name required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const cardDigits = cardNumber.replace(/\s/g, '');
    const last4 = cardDigits.slice(-4);
    let type = 'Card';
    if (cardDigits.startsWith('4')) type = 'Visa';
    else if (cardDigits.startsWith('5')) type = 'Mastercard';
    else if (cardDigits.startsWith('3')) type = 'Amex';
    
    onAdd({ type, last4, expiry, isDefault, name });
    setCardNumber(''); setExpiry(''); setCvc(''); setName(''); setIsDefault(false); setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-pink-600" />
            Add Payment Method
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <p className="font-medium text-blue-900 mb-1">Test Cards:</p>
            <p className="text-blue-700">Visa: 4242 4242 4242 4242</p>
            <p className="text-blue-700">Mastercard: 5555 5555 5555 4444</p>
          </div>
          
          <div>
            <Label>Card Number</Label>
            <Input value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} 
              placeholder="1234 5678 9012 3456" maxLength={19} className={errors.cardNumber ? 'border-red-500' : ''} />
            {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Expiry</Label>
              <Input value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} 
                placeholder="MM/YY" maxLength={5} className={errors.expiry ? 'border-red-500' : ''} />
              {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
            </div>
            <div>
              <Label>CVC</Label>
              <Input value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))} 
                placeholder="123" maxLength={4} className={errors.cvc ? 'border-red-500' : ''} />
              {errors.cvc && <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>}
            </div>
          </div>
          
          <div>
            <Label>Cardholder Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} 
              placeholder="John Doe" className={errors.name ? 'border-red-500' : ''} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="default" checked={isDefault} onCheckedChange={(checked) => setIsDefault(checked as boolean)} />
            <Label htmlFor="default" className="cursor-pointer">Set as default payment method</Label>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 bg-pink-600 hover:bg-pink-700">Add Card</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
