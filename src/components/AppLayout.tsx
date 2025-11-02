import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EntrancePage } from './EntrancePage';
import { Login } from './Login';
import { AgeGate } from './AgeGate';
import { RoleSelect } from './RoleSelect';
import { Feed } from './Feed';
import { Search } from './Search';
import { Navigation } from './Navigation';
import { TopBar } from './TopBar';
import { Messages } from './Messages';
import { Profile } from './Profile';
import { Bookings } from './Bookings';
import { Settings } from './Settings';
import { WorkerDashboard } from './WorkerDashboard';
import { WorkerBookings } from './WorkerBookings';
import { WorkerProfileSetup } from './WorkerProfileSetup';
import { WorkerWallet } from './WorkerWallet';
import WorkerAnalytics from './WorkerAnalytics';
import { WorkerCalendar } from './WorkerCalendar';
import FinancialReports from './FinancialReports';
import ProfileLayout from './ProfileLayout';
import BlockedUsers from './BlockedUsers';
import { WorkerServices } from './WorkerServices';
import { CustomerProfile } from './CustomerProfile';
import { SessionTimeoutModal } from './SessionTimeoutModal';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { Footer } from './Footer';
import { useAppContext } from '@/contexts/AppContext';


type AppState = 'entrance' | 'login' | 'age-gate' | 'role-select' | 'feed' | 'search' | 'messages' | 'profile' | 'bookings' | 'settings' | 'following' | 'events' | 'wallet' | 'profile-setup' | 'analytics' | 'calendar' | 'financial' | 'blocked' | 'services' | 'forum' | 'subscription';


type UserRole = 'customer' | 'sugar' | 'worker' | null;


const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fromLogout = location.state?.fromLogout;
  const sessionExpired = location.state?.sessionExpired;
  const [appState, setAppState] = useState<AppState>(fromLogout || sessionExpired ? 'login' : 'entrance');
  const { userRole, setUserRole: setContextUserRole } = useAppContext();
  const [localUserRole, setLocalUserRole] = useState<UserRole>(null);

  const handleSessionTimeout = () => {
    setLocalUserRole(null);
    setContextUserRole(null);
    setAppState('login');
    navigate('/', { state: { sessionExpired: true }, replace: true });
  };

  const { showWarning, timeRemaining, extendSession } = useSessionTimeout(handleSessionTimeout);

  const handleLogoutNow = () => {
    setLocalUserRole(null);
    setContextUserRole(null);
    setAppState('login');
    navigate('/', { state: { fromLogout: true }, replace: true });
  };

  const handleEnter = () => setAppState('login');
  const handleLogin = () => setAppState('age-gate');
  const handleAgeVerified = () => setAppState('role-select');
  const handleRoleSelect = (role: 'customer' | 'sugar' | 'worker') => {
    setLocalUserRole(role);
    setContextUserRole(role);
    setAppState('feed');
  };

  const showNavigation = !['entrance', 'login', 'age-gate', 'role-select'].includes(appState);
  const isWorker = (userRole || localUserRole) === 'worker';
  const isLoggedIn = showNavigation;


  return (
    <div className="min-h-screen bg-zinc-50">
      {showNavigation && (
        <>
          <Navigation currentPage={appState} onNavigate={(page) => setAppState(page as AppState)} />
          <TopBar />
        </>
      )}
      <main className={showNavigation ? 'ml-52 pt-16' : ''}>
        {appState === 'entrance' && <EntrancePage onEnter={handleEnter} />}
        {appState === 'login' && <Login onLogin={handleLogin} />}
        {appState === 'age-gate' && <AgeGate onVerified={handleAgeVerified} />}
        {appState === 'role-select' && <RoleSelect onRoleSelect={handleRoleSelect} />}
        {appState === 'feed' && (isWorker ? <WorkerDashboard onNavigate={(page) => setAppState(page as AppState)} /> : <Feed />)}
        {appState === 'search' && <Search />}
        {appState === 'messages' && <Messages />}
        {appState === 'bookings' && (isWorker ? <WorkerBookings /> : <Bookings />)}
        {appState === 'services' && isWorker && <WorkerServices />}
        {appState === 'forum' && <div className="p-8"><h1 className="text-2xl font-bold">Forum</h1></div>}

        {appState === 'following' && <div className="p-8"><h1 className="text-2xl font-bold">Following/Subscribed</h1></div>}
        {appState === 'events' && <div className="p-8"><h1 className="text-2xl font-bold">Events</h1></div>}
        {appState === 'calendar' && isWorker && <WorkerCalendar />}
        {appState === 'financial' && isWorker && <FinancialReports />}
        {appState === 'blocked' && isWorker && <BlockedUsers />}
        
        {['profile', 'settings', 'wallet', 'analytics', 'profile-setup'].includes(appState) && isWorker && (
          <ProfileLayout currentSection={appState} onNavigate={(section) => setAppState(section as AppState)}>
            {appState === 'profile' && <Profile />}
            {appState === 'settings' && <Settings />}
            {appState === 'wallet' && <WorkerWallet />}
            {appState === 'analytics' && <WorkerAnalytics />}
            {appState === 'profile-setup' && <WorkerProfileSetup />}
          </ProfileLayout>
        )}
        
        {['profile', 'settings', 'wallet', 'blocked', 'subscription'].includes(appState) && !isWorker && (
          <ProfileLayout currentSection={appState} onNavigate={(section) => setAppState(section as AppState)}>
            {appState === 'profile' && <CustomerProfile />}
            {appState === 'settings' && <Settings />}
            {appState === 'wallet' && <div className="p-8"><h1 className="text-2xl font-bold text-pink-600">Wallet</h1><p className="text-gray-600 mt-4">Manage your payment methods and transaction history.</p></div>}
            {appState === 'blocked' && <BlockedUsers />}
            {appState === 'subscription' && <div className="p-8"><h1 className="text-2xl font-bold text-pink-600">Subscription</h1><p className="text-gray-600 mt-4">Manage your subscription and premium features.</p></div>}
          </ProfileLayout>
        )}


      </main>

      {/* Session Timeout Modal - Only show when logged in */}
      {isLoggedIn && (
        <SessionTimeoutModal
          open={showWarning}
          timeRemaining={timeRemaining}
          onStayLoggedIn={extendSession}
          onLogout={handleLogoutNow}
        />
      )}
    <Footer />
    </div>
  );
};

export default AppLayout;
