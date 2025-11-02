import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import { User, Settings, Wallet, UserX, Crown } from 'lucide-react';

interface ProfileLayoutProps {
  children: ReactNode;
  currentSection: string;
  onNavigate: (section: string) => void;
}

export default function ProfileLayout({ children, currentSection, onNavigate }: ProfileLayoutProps) {
  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'blocked', label: 'Blocked', icon: UserX },
    { id: 'subscription', label: 'Subscription', icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <div className="space-y-2 sticky top-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    onClick={() => onNavigate(section.id)}
                    variant="outline"
                    className={
                      currentSection === section.id
                        ? 'w-full justify-start bg-gradient-to-r from-pink-100 to-rose-100 border-pink-300 text-pink-700 hover:from-pink-200 hover:to-rose-200 font-semibold shadow-sm'
                        : 'w-full justify-start border-pink-100 text-gray-700 hover:bg-pink-50 hover:border-pink-200'
                    }
                  >
                    <Icon className={`w-4 h-4 mr-2 ${currentSection === section.id ? 'text-pink-600' : 'text-gray-500'}`} />
                    {section.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-sm border border-pink-100 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
