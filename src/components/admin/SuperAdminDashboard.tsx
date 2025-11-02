import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, BarChart3, Flag, Users, MessageSquare, AlertTriangle, Settings, DollarSign, Lock, Database, Plug, Gift, Image } from 'lucide-react';


import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import PlatformStats from './PlatformStats';
import RecentActivity from './RecentActivity';
import ReviewModeration from './ReviewModeration';
import UserManagement from './UserManagement';
import ContentModeration from './ContentModeration';
import DisputeResolution from './DisputeResolution';
import AnalyticsDashboard from './AnalyticsDashboard';
import FinancialManagement from './FinancialManagement';
import SystemSettings from './SystemSettings';
import SecurityLogs from './SecurityLogs';
import Integrations from './Integrations';
import GiftManagement from './GiftManagement';
import ExclusiveContentManagement from './ExclusiveContentManagement';





export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-zinc-900 border-b border-pink-500/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1762073252193_5174dc4d.png" 
                alt="Lust Story" 
                className="h-12"
                style={{ filter: 'drop-shadow(0 0 20px rgba(255, 20, 147, 0.8))' }}
              />



              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/50">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-pink-400" style={{ textShadow: '0 0 15px rgba(255, 20, 147, 0.8)' }}>Super Admin Dashboard</h1>
                <p className="text-sm text-pink-300">Platform Control Center</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                onClick={() => navigate('/login/super-admin')}
                variant="outline"
                className="bg-pink-500/20 border-pink-500/50 text-pink-300 hover:bg-pink-500/30 hover:text-pink-200"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>



      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-12 w-full mb-6 bg-zinc-900 border border-pink-500/30 p-1">


            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <BarChart3 className="w-3 h-3" />Overview
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <DollarSign className="w-3 h-3" />Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <DollarSign className="w-3 h-3" />Financial
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <Users className="w-3 h-3" />Users
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <Flag className="w-3 h-3" />Content
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <MessageSquare className="w-3 h-3" />Reviews
            </TabsTrigger>
            <TabsTrigger 
              value="disputes" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <AlertTriangle className="w-3 h-3" />Disputes
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <Lock className="w-3 h-3" />Security
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <Plug className="w-3 h-3" />Integrations
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <Settings className="w-3 h-3" />Settings
            </TabsTrigger>
            <TabsTrigger 
              value="gifts" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <Gift className="w-3 h-3" />Gifts
            </TabsTrigger>
            <TabsTrigger 
              value="exclusive" 
              className="flex items-center gap-1 text-xs data-[state=active]:bg-[#FF1493] data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-pink-300 transition-all"
            >
              <Image className="w-3 h-3" />Exclusive
            </TabsTrigger>

          </TabsList>


          <TabsContent value="overview" className="space-y-6">
            <PlatformStats />
            <RecentActivity />
          </TabsContent>
          <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
          <TabsContent value="financial"><FinancialManagement /></TabsContent>
          <TabsContent value="users"><UserManagement /></TabsContent>

          <TabsContent value="content"><ContentModeration /></TabsContent>
          <TabsContent value="reviews"><ReviewModeration /></TabsContent>
          <TabsContent value="disputes"><DisputeResolution /></TabsContent>
          <TabsContent value="security"><SecurityLogs /></TabsContent>
          <TabsContent value="integrations"><Integrations /></TabsContent>
          <TabsContent value="settings"><SystemSettings /></TabsContent>
          <TabsContent value="gifts"><GiftManagement /></TabsContent>
          <TabsContent value="exclusive"><ExclusiveContentManagement /></TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
