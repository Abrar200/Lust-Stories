import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { User, Settings } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole } = useAppContext();

  // Worker navigation items
  const workerNavItems = [
    { 
      name: 'Home', 
      path: '/',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="8" height="8" rx="2"/>
          <rect x="13" y="3" width="8" height="8" rx="2"/>
          <rect x="3" y="13" width="8" height="8" rx="2"/>
          <rect x="13" y="13" width="8" height="8" rx="2"/>
        </svg>
      )
    },
    { 
      name: 'Search', 
      path: '/search',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      )
    },
    { 
      name: 'Messages', 
      path: '/messages',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <circle cx="9" cy="10" r="1" fill="currentColor"/>
          <circle cx="12" cy="10" r="1" fill="currentColor"/>
          <circle cx="15" cy="10" r="1" fill="currentColor"/>
        </svg>
      )
    },
    { 
      name: 'Bookings', 
      path: '/bookings',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
        </svg>
      )
    },
    { 
      name: 'Services', 
      path: '/services',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      )
    },
    { 
      name: 'Forum', 
      path: '/forum',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      )
    },
  ];

  // Client navigation items
  const clientNavItems = [
    { 
      name: 'Home', 
      path: '/',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="8" height="8" rx="2"/>
          <rect x="13" y="3" width="8" height="8" rx="2"/>
          <rect x="3" y="13" width="8" height="8" rx="2"/>
          <rect x="13" y="13" width="8" height="8" rx="2"/>
        </svg>
      )
    },
    { 
      name: 'Search', 
      path: '/search',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      )
    },
    { 
      name: 'Messages', 
      path: '/messages',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <circle cx="9" cy="10" r="1" fill="currentColor"/>
          <circle cx="12" cy="10" r="1" fill="currentColor"/>
          <circle cx="15" cy="10" r="1" fill="currentColor"/>
        </svg>
      )
    },
    { 
      name: 'Bookings', 
      path: '/bookings',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
        </svg>
      )
    },
    { 
      name: 'Following', 
      path: '/following',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    { 
      name: 'Events', 
      path: '/events',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="12" y1="14" x2="12" y2="18"/>
          <line x1="10" y1="16" x2="14" y2="16"/>
        </svg>
      )
    },
  ];

  const navItems = userRole === 'worker' ? workerNavItems : clientNavItems;

  const bottomNavItems = [
    { 
      name: 'Profile', 
      path: '/profile',
      icon: <User className="w-6 h-6" />
    },
    { 
      name: 'Settings', 
      path: '/settings',
      icon: <Settings className="w-6 h-6" />
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-52 bg-white border-r border-zinc-200 flex flex-col">
      <div className="p-6">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761998172202_86657271.png" 
          alt="Lust Story" 
          className="w-full h-auto"
        />
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition-colors ${
              location.pathname === item.path
                ? 'text-pink-600 font-medium'
                : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {item.icon}
            <span className="text-base">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="px-3 pb-6 border-t border-zinc-200 pt-4">
        {bottomNavItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition-colors ${
              location.pathname === item.path
                ? 'text-pink-600 font-medium'
                : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {item.icon}
            <span className="text-base">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
