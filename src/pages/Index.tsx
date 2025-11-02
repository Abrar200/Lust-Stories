import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Navigation } from '@/components/Navigation';
import { TopBar } from '@/components/TopBar';
import { Feed } from '@/components/Feed';
import { WorkerDashboard } from '@/components/WorkerDashboard';
import { AppProvider, useAppContext } from '@/contexts/AppContext';

const IndexContent: React.FC = () => {
  const { userRole } = useAppContext();

  // If user is not logged in, show the entrance flow
  if (!userRole) {
    return <AppLayout />;
  }

  // If user is logged in, show the home feed
  const isWorker = userRole === 'worker';

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />
      <TopBar />
      <main className="ml-52 pt-16">
        {isWorker ? <WorkerDashboard /> : <Feed />}
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <IndexContent />
    </AppProvider>
  );
};

export default Index;
