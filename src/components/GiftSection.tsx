import React, { useState } from 'react';
import { Gift, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface GiftSectionProps {
  workerName: string;
  workerId: string;
}

export const GiftSection: React.FC<GiftSectionProps> = ({ workerName, workerId }) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const gifts = [
    { id: 1, name: 'Luxury Gift Box', price: 50, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084827231_e1e242cc.webp' },
    { id: 2, name: 'Rose Bouquet', price: 75, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084827988_e5263029.webp' },
    { id: 3, name: 'Champagne & Glasses', price: 120, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084828991_d1c1ff63.webp' },
    { id: 4, name: 'Diamond Necklace', price: 500, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084829759_009c1577.webp' },
    { id: 5, name: 'Designer Perfume', price: 150, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084830566_97df2842.webp' },
    { id: 6, name: 'Luxury Chocolates', price: 60, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084831933_c447e821.webp' },
    { id: 7, name: 'Designer Handbag', price: 800, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084832664_9badf695.webp' },
    { id: 8, name: 'Spa Gift Basket', price: 200, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084833651_22a0a027.webp' },
    { id: 9, name: 'Gold Bracelet', price: 350, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084840620_73ec413d.webp' },
    { id: 10, name: 'Designer Sunglasses', price: 250, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084841665_12583c73.webp' },
    { id: 11, name: 'Luxury Watch', price: 1200, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084842695_8ca550cf.webp' },
    { id: 12, name: 'Teddy Bear', price: 40, image: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1762084843791_3915b3cc.webp' },
  ];

  const handleSendGift = async (giftId: number, giftName: string, price: number) => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount: price * 100, description: `Gift: ${giftName} for ${workerName}` }
      });
      if (error) throw error;
      toast({ title: 'Gift Sent!', description: `${giftName} has been sent to ${workerName}` });
    } catch (err) {
      toast({ title: 'Failed to Send Gift', description: 'Unable to process payment.', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-xl mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Send a Gift</h2>
        </div>
        <p className="text-pink-50">Show your appreciation by sending {workerName} a special gift</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gifts.map((gift) => (
          <div key={gift.id} className="bg-white p-4 rounded-xl border-2 border-pink-200 shadow-sm hover:shadow-md transition-all">
            <img src={gift.image} alt={gift.name} className="w-full h-40 object-cover rounded-lg mb-3" />
            <h3 className="font-semibold text-zinc-800 mb-1">{gift.name}</h3>
            <p className="text-2xl font-bold text-pink-600 mb-3">${gift.price}</p>
            <Button onClick={() => handleSendGift(gift.id, gift.name, gift.price)} disabled={isSending} className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
              <Heart className="w-4 h-4 mr-2" />Send Gift
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
