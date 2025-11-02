import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Crown, Check } from 'lucide-react';

export default function CustomerSubscription() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [currentPlan, setCurrentPlan] = useState<'monthly' | 'annual' | null>('monthly');
  const { toast } = useToast();

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value as 'monthly' | 'annual');
  };

  const handleUpdatePlan = () => {
    setCurrentPlan(selectedPlan);
    toast({
      title: 'Subscription Updated',
      description: `Your subscription has been changed to ${selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} plan.`,
    });
  };

  const handleCancelSubscription = () => {
    setCurrentPlan(null);
    toast({
      title: 'Subscription Cancelled',
      description: 'Your subscription has been cancelled. You will have access until the end of your billing period.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent flex items-center gap-2">
          <Crown className="w-8 h-8 text-pink-600" />
          Subscription
        </h1>
        {currentPlan && (
          <p className="text-gray-600 mt-1">
            Current Plan: <span className="font-semibold text-pink-600">
              {currentPlan === 'monthly' ? 'Monthly ($29.99)' : 'Annual ($299.99)'}
            </span>
          </p>
        )}
      </div>

      <Card className="p-6 border-pink-100">
        <RadioGroup value={selectedPlan} onValueChange={handlePlanChange} className="space-y-4">
          <div className={`flex items-center justify-between p-5 border-2 rounded-lg transition-all cursor-pointer ${selectedPlan === 'monthly' ? 'border-pink-400 bg-gradient-to-r from-pink-50 to-rose-50' : 'border-pink-200 hover:border-pink-300 bg-white'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="monthly" id="monthly" className="border-pink-500 text-pink-600" />
              <div>
                <Label htmlFor="monthly" className="text-lg font-semibold cursor-pointer">Monthly Plan</Label>
                <p className="text-sm text-gray-600">Billed monthly</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-pink-600">$29.99</span>
          </div>

          <div className={`flex items-center justify-between p-5 border-2 rounded-lg transition-all cursor-pointer ${selectedPlan === 'annual' ? 'border-pink-400 bg-gradient-to-r from-pink-50 to-rose-50' : 'border-pink-200 hover:border-pink-300 bg-white'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="annual" id="annual" className="border-pink-500 text-pink-600" />
              <div>
                <Label htmlFor="annual" className="text-lg font-semibold cursor-pointer">Annual Plan</Label>
                <p className="text-sm text-gray-600">Billed annually</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-pink-600">$299.99</span>
              <p className="text-sm text-green-600 font-semibold">Save $59.89</p>
            </div>
          </div>
        </RadioGroup>

        {selectedPlan !== currentPlan && currentPlan && (
          <Button onClick={handleUpdatePlan} className="w-full mt-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white">
            Update Subscription
          </Button>
        )}
      </Card>

      {currentPlan && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
              Cancel Subscription
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelSubscription} className="bg-red-600 hover:bg-red-700">
                Cancel Subscription
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {!currentPlan && (
        <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
          <p className="text-center text-gray-700 mb-4 font-medium">You don't have an active subscription</p>
          <Button onClick={() => setCurrentPlan(selectedPlan)} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white">
            <Crown className="w-4 h-4 mr-2" />
            Subscribe Now
          </Button>
        </Card>
      )}
    </div>
  );
}
