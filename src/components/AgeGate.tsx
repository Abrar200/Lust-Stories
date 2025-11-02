import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface AgeGateProps {
  onVerified: () => void;
}

export const AgeGate: React.FC<AgeGateProps> = ({ onVerified }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-900 via-purple-900 to-black p-4">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/6903ab95b98f07e4a1b45bff_1761848435482_4f4e3d12.webp"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <Card className="relative z-10 max-w-md w-full p-8 bg-black/80 backdrop-blur-lg border-pink-500/30">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            LUST STORY
          </h1>
          
          <div className="space-y-4 text-gray-300">
            <p className="text-lg font-semibold">Age Verification Required</p>
            <p className="text-sm">This platform contains adult content and is restricted to users 18 years or older.</p>
          </div>

          <div className="flex items-start space-x-3 text-left">
            <Checkbox 
              id="age-verify" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="age-verify" className="text-sm text-gray-300 cursor-pointer">
              I confirm that I am at least 18 years old and agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <Button 
            onClick={onVerified}
            disabled={!agreed}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-6 text-lg"
          >
            Enter
          </Button>
        </div>
      </Card>
    </div>
  );
};
