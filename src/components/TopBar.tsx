import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, User, X, Check, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface TopBarProps {
  username?: string;
}

interface Notification {
  id: string;
  type: 'message' | 'booking' | 'payment' | 'general';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ username = 'Tom' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'New Booking',
      message: 'You have a new booking request from Sarah',
      time: '5 min ago',
      read: false
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      message: 'Mike sent you a message',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      message: 'You received $150 for your service',
      time: '2 hours ago',
      read: false
    }
  ]);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userRole');
    navigate('/', { state: { fromLogout: true }, replace: true });
  };


  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id);
    setShowNotifications(false);
    
    // Navigate based on notification type
    switch(notif.type) {
      case 'booking':
        navigate('/bookings');
        break;
      case 'message':
        navigate('/messages');
        break;
      case 'payment':
        navigate('/profile'); // Navigate to profile where wallet/payments are
        break;
      default:
        break;
    }
  };


  const getIcon = (type: string) => {
    switch(type) {
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'booking': return <Calendar className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <header className="fixed top-0 left-52 right-0 h-16 bg-white border-b border-zinc-200 flex items-center justify-end px-6 z-40">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5 text-zinc-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-zinc-200 max-h-[500px] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-zinc-200">
                <h3 className="font-semibold text-zinc-900">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-pink-600 hover:text-pink-700"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-zinc-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[400px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors ${
                        !notif.read ? 'bg-pink-50/50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notif)}

                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-full ${
                          notif.type === 'message' ? 'bg-blue-100 text-blue-600' :
                          notif.type === 'booking' ? 'bg-green-100 text-green-600' :
                          notif.type === 'payment' ? 'bg-purple-100 text-purple-600' :
                          'bg-zinc-100 text-zinc-600'
                        }`}>
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm text-zinc-900">{notif.title}</h4>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-pink-500 rounded-full mt-1"></span>
                            )}
                          </div>
                          <p className="text-sm text-zinc-600 mt-1">{notif.message}</p>
                          <span className="text-xs text-zinc-400 mt-1">{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-zinc-100 px-3 py-2 rounded-lg transition-colors"
          >
            <span className="text-sm text-zinc-700">Welcome back, {username}</span>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-zinc-200 py-1">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <User className="w-4 h-4" />
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
