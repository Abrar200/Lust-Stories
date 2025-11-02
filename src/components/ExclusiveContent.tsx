import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ExclusiveContentProps {
  workerName: string;
}

export const ExclusiveContent: React.FC<ExclusiveContentProps> = ({ workerName }) => {
  const [unlockedContent, setUnlockedContent] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const exclusiveContent = [
    { id: 1, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915661951_225fc59e.webp', price: 25, title: 'Private Photo Set 1' },
    { id: 2, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915663643_a459917b.webp', price: 30, title: 'Exclusive Video 1' },
    { id: 3, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915633972_931c9223.webp', price: 25, title: 'Private Photo Set 2' },
    { id: 4, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915635794_c2084770.webp', price: 40, title: 'VIP Video Content' },
    { id: 5, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915647740_a4a6a2c4.webp', price: 35, title: 'Behind the Scenes' },
    { id: 6, thumbnail: 'https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761915649538_7c01b0e3.webp', price: 50, title: 'Premium Collection' },
  ];

  const handleUnlock = async (contentId: number, price: number) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount: price * 100, description: `Unlock exclusive content from ${workerName}` }
      });
      if (error) throw error;
      setUnlockedContent(prev => new Set(prev).add(contentId));
      toast({ title: 'Content Unlocked!', description: 'You now have access to this exclusive content.' });
    } catch (err) {
      toast({ title: 'Payment Failed', description: 'Unable to process payment.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {exclusiveContent.map((content) => {
        const isUnlocked = unlockedContent.has(content.id);
        return (
          <div key={content.id} className="relative group">
            <img src={content.thumbnail} alt={content.title} className="w-full h-64 object-cover rounded-xl border border-pink-200" />
            {!isUnlocked && (
              <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center gap-3">
                <Lock className="w-12 h-12 text-white" />
                <p className="text-white font-semibold">{content.title}</p>
                <Button onClick={() => handleUnlock(content.id, content.price)} disabled={isProcessing} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                  Unlock ${content.price}
                </Button>
              </div>
            )}
            {isUnlocked && (
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-2">
                <Unlock className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
