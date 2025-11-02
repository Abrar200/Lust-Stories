import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RoleSelectProps {
  onRoleSelect: (role: 'customer' | 'sugar' | 'worker') => void;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]">
            Choose Your Role
          </h1>
          <p className="text-zinc-400 text-lg">Select how you'd like to use Lust Story</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-8 bg-zinc-900 border-zinc-800 hover:border-pink-500 transition-all cursor-pointer group hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                onClick={() => onRoleSelect('customer')}>
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white text-center">Customer</h3>
              <p className="text-sm text-zinc-400 text-center">Browse and book services from verified professionals</p>
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-6">Select</Button>
            </div>
          </Card>

          <Card className="p-8 bg-zinc-900 border-pink-500 hover:border-pink-400 transition-all cursor-pointer group hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] relative overflow-hidden"
                onClick={() => onRoleSelect('sugar')}>
            <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold">PREMIUM</div>
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_25px_rgba(236,72,153,0.6)]">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path d="M12 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  <circle cx="8" cy="9" r="1.5" fill="white"/>
                  <circle cx="16" cy="9" r="1.5" fill="white"/>
                  <path d="M12 15l2 3h-4l2-3z" fill="white"/>
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white text-center">Sugar Daddy/Mama</h3>
              <p className="text-sm text-zinc-400 text-center">Premium access with exclusive filters and perks</p>
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-6">Select</Button>
            </div>
          </Card>

          <Card className="p-8 bg-zinc-900 border-zinc-800 hover:border-pink-500 transition-all cursor-pointer group hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                onClick={() => onRoleSelect('worker')}>
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  {/* Long flowing hair */}
                  <path d="M12 2C10 2 8 3 7 5c-1 2 0 4 0 6 0 1-1 2-2 3v2c0 0 1 0 2-1 0 2 1 3 2 4 0 0-1 1-1 2v1h8v-1c0-1-1-2-1-2 1-1 2-2 2-4 1 1 2 1 2 1v-2c-1-1-2-2-2-3 0-2 1-4 0-6-1-2-3-3-5-3z" opacity="0.95"/>
                  {/* Curvy body/figure */}
                  <path d="M10 12c0 1 0 2 1 3 0 1 0 2 1 3 1-1 1-2 1-3 1-1 1-2 1-3-1 0-1-1-2-1-1 0-1 1-2 1z" fill="white" opacity="0.85"/>
                  {/* Chest area */}
                  <circle cx="10.5" cy="13" r="1.2" fill="white" opacity="0.7"/>
                  <circle cx="13.5" cy="13" r="1.2" fill="white" opacity="0.7"/>
                  {/* Legs in split/provocative pose */}
                  <path d="M11 18c-1 2-2 3-3 4M13 18c1 2 2 3 3 4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.9"/>
                  {/* Pole */}
                  <rect x="19" y="2" width="2" height="20" fill="white" opacity="0.9" rx="1"/>
                  {/* Hand on pole */}
                  <circle cx="19.5" cy="10" r="1.5" fill="white" opacity="0.95"/>
                  {/* Arched back pose - arm reaching to pole */}
                  <path d="M13 13c1-1 3-2 5-3" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.9"/>
                </svg>

              </div>

              <h3 className="text-2xl font-bold text-white text-center">Worker</h3>
              <p className="text-sm text-zinc-400 text-center">Offer your services and manage bookings professionally</p>
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-6">Select</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
