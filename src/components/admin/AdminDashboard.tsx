import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, BarChart3, Flag, Users, MessageSquare, AlertTriangle } from 'lucide-react';
import ReviewModeration from './ReviewModeration';
import UserVerification from './UserVerification';
import ContentModeration from './ContentModeration';
import DisputeResolution from './DisputeResolution';
import AnalyticsDashboard from './AnalyticsDashboard';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-pink-600" />
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
              <p className="text-sm text-zinc-600">Platform Moderation & Management</p>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="disputes" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Disputes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
          <TabsContent value="reviews"><ReviewModeration /></TabsContent>
          <TabsContent value="users"><UserVerification /></TabsContent>
          <TabsContent value="content"><ContentModeration /></TabsContent>
          <TabsContent value="disputes"><DisputeResolution /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
