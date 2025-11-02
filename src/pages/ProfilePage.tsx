import { Profile } from '@/components/Profile';
import { CustomerProfile } from '@/components/CustomerProfile';
import { TopBar } from '@/components/TopBar';
import { Navigation } from '@/components/Navigation';
import { useAppContext } from '@/contexts/AppContext';
import ProfileLayout from '@/components/ProfileLayout';
import { Settings } from '@/components/Settings';
import { WorkerWallet } from '@/components/WorkerWallet';
import WorkerAnalytics from '@/components/WorkerAnalytics';
import { WorkerProfileSetup } from '@/components/WorkerProfileSetup';
import BlockedUsers from '@/components/BlockedUsers';
import CustomerSubscription from '@/components/CustomerSubscription';
import CustomerWallet from '@/components/CustomerWallet';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';




export default function ProfilePage() {
  const { userRole } = useAppContext();
  const isWorker = userRole === 'worker';
  const [currentSection, setCurrentSection] = useState<string>('profile');
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />
      <div className="ml-52">
        <TopBar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 hover:bg-pink-100"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>

          {isWorker ? (
            <ProfileLayout currentSection={currentSection} onNavigate={setCurrentSection}>
              {currentSection === 'profile' && <Profile />}
              {currentSection === 'settings' && <Settings />}
              {currentSection === 'wallet' && <WorkerWallet />}
              {currentSection === 'analytics' && <WorkerAnalytics />}
              {currentSection === 'profile-setup' && <WorkerProfileSetup />}
            </ProfileLayout>
          ) : (
            <ProfileLayout currentSection={currentSection} onNavigate={setCurrentSection}>
              {currentSection === 'profile' && <CustomerProfile />}
              {currentSection === 'settings' && <Settings />}
              {currentSection === 'wallet' && <CustomerWallet />}

              {currentSection === 'blocked' && <BlockedUsers />}
              {currentSection === 'subscription' && <CustomerSubscription />}

            </ProfileLayout>
          )}
        </div>
      </div>
    </div>
  );
}
