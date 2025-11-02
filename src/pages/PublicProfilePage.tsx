import { PublicProfile } from '@/components/PublicProfile';
import { TopBar } from '@/components/TopBar';
import { Navigation } from '@/components/Navigation';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function PublicProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
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
          <PublicProfile userId={userId} />

        </div>
      </div>
    </div>
  );
}
