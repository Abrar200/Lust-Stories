import { Navigation } from '@/components/Navigation';
import { TopBar } from '@/components/TopBar';
import { Search } from '@/components/Search';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <TopBar />
      <main className="ml-52 pt-16 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-pink-100 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
        <Search />
      </main>
    </div>
  );
};


export default SearchPage;
