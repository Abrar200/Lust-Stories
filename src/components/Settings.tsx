import React, { useState } from 'react';
import { User, Bell, Lock, Shield, LogOut, Mail, MessageSquare, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import BlockedUsers from './BlockedUsers';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole } = useAppContext();
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setUserRole(null);
    navigate('/', { state: { fromLogout: true } });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card className="bg-white border-pink-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-pink-600" />
              <h2 className="text-xl font-semibold">Account Settings</h2>
            </div>
            <div className="space-y-4">
              <div><Label>Email</Label><Input defaultValue="user@example.com" className="bg-white border-gray-300" /></div>
              <div><Label>Phone</Label><Input defaultValue="+1 (555) 123-4567" className="bg-white border-gray-300" /></div>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white border-pink-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-pink-600" />
              <h2 className="text-xl font-semibold">Booking Reminders</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-pink-500" /><Label>SMS Reminders</Label></div>
                  <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-pink-500" /><Label>Email Reminders</Label></div>
                  <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                </div>
              </div>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white w-full">Save Preferences</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-white border-pink-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-pink-600" />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><Label>Two-Factor Authentication</Label><Switch checked={twoFactor} onCheckedChange={setTwoFactor} /></div>
              <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">Change Password</Button>
            </div>
          </Card>

          <Card className="bg-white border-pink-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-pink-600" />
              <h2 className="text-xl font-semibold">Admin Access</h2>
            </div>
            <Button onClick={() => navigate('/admin')} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white">
              <Shield className="w-4 h-4 mr-2" />Open Admin Dashboard
            </Button>
          </Card>

          <Button onClick={handleLogout} variant="destructive" className="w-full bg-red-500 hover:bg-red-600"><LogOut className="w-4 h-4 mr-2" />Log Out</Button>
        </TabsContent>

        <TabsContent value="blocked">
          <BlockedUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
};
