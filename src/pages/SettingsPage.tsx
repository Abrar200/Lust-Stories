import { Settings } from '@/components/Settings';
import { TopBar } from '@/components/TopBar';
import { Navigation } from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />
      <div className="ml-52">
        <TopBar />
        <div className="p-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 hover:bg-pink-100">
            <ArrowLeft className="h-5 w-5 mr-2" />Back
          </Button>
          <Settings />

        </div>
      </div>
    </div>
  );
}
