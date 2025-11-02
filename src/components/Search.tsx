import React, { useState, useEffect } from 'react';
import { WorkerCard } from './WorkerCard';
import { SearchFilters } from './SearchFilters';
import { SavedSearches } from './SavedSearches';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Search as SearchIcon, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [workers, setWorkers] = useState<any[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [radius, setRadius] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, workers]);

  const loadWorkers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'worker')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setWorkers(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let results = [...workers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(w => 
        w.full_name?.toLowerCase().includes(query) ||
        w.bio?.toLowerCase().includes(query)
      );
    }

    if (filters.services?.length > 0) {
      results = results.filter(w => 
        filters.services.some((s: string) => w.services?.includes(s))
      );
    }

    if (filters.minAge || filters.maxAge) {
      results = results.filter(w => {
        const age = w.age || 0;
        return (!filters.minAge || age >= filters.minAge) && 
               (!filters.maxAge || age <= filters.maxAge);
      });
    }

    if (filters.ethnicity) {
      results = results.filter(w => w.ethnicity === filters.ethnicity);
    }

    setFilteredWorkers(results);
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  const getActiveFilters = () => {
    const active = [];
    if (filters.services?.length > 0) {
      active.push({ key: 'services', label: filters.services[0] });
    }
    if (filters.minAge && filters.maxAge) {
      active.push({ key: 'age', label: `Age ${filters.minAge}-${filters.maxAge}` });
    }
    if (filters.ethnicity) {
      active.push({ key: 'ethnicity', label: filters.ethnicity });
    }
    return active;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-12 h-12 bg-white border-gray-200 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
            />
          </div>

          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-12 px-4 border-gray-200 rounded-xl transition-all duration-300 hover:border-pink-300 hover:bg-pink-50 transform hover:scale-105">
                <MapPin className="w-4 h-4 mr-2 text-pink-600" />
                <span className="text-sm">Radius {radius}km</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[600px] rounded-t-3xl">
              <div className="max-w-2xl mx-auto py-6">
                <div className="bg-gray-100 rounded-2xl overflow-hidden mb-6 h-64 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/20 border-2 border-pink-500"
                        style={{ 
                          width: `${radius * 80}px`, 
                          height: `${radius * 80}px`,
                          transition: 'all 0.3s ease'
                        }}
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full shadow-lg" />
                    </div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">Radius</h2>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <Slider
                        value={[radius]}
                        onValueChange={(values) => setRadius(values[0])}
                        min={0.5}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-2xl px-6 py-3 min-w-[120px] text-center">
                      <span className="text-2xl font-bold text-gray-900">{radius}km</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>


          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12 border-gray-200 rounded-xl transition-all duration-300 hover:border-pink-300 hover:bg-pink-50 transform hover:scale-105">
                <SlidersHorizontal className="w-5 h-5 text-pink-600" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-96 flex flex-col animate-in slide-in-from-right duration-500">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-pink-600">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 overflow-y-auto flex-1 pr-2">
                <SearchFilters filters={filters} onFilterChange={setFilters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {getActiveFilters().length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
            {getActiveFilters().map((filter, idx) => (
              <Badge 
                key={filter.key}
                variant="outline" 
                className="px-3 py-1.5 text-sm border-gray-300 bg-white rounded-full transition-all duration-300 hover:border-pink-400 hover:bg-pink-50 animate-in fade-in zoom-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.key)}
                  className="ml-2 hover:text-pink-600 transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker, idx) => (
            <div key={worker.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
              <WorkerCard
                id={worker.id}
                name={worker.full_name}
                avatar={worker.avatar_url}
                type={worker.worker_type || 'Stripper'}
                rating={worker.average_rating || 4.5}
                reviewCount={worker.total_reviews || 0}
                price={worker.hourly_rate}
                location={`${worker.location_city}, ${worker.location_state}`}
                age={worker.age}
                bio={worker.bio}
                verified={worker.verified}
                online={worker.is_online}
                services={worker.services || []}
                onMessage={() => toast({ title: `Message ${worker.full_name}` })}
                onBook={() => toast({ title: `Book ${worker.full_name}` })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};
