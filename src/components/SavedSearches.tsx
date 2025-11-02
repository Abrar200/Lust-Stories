import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bookmark, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavedSearchesProps {
  currentFilters: any;
  onLoadSearch: (filters: any) => void;
}

export function SavedSearches({ currentFilters, onLoadSearch }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [searchName, setSearchName] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedSearches(data);
    }
  };

  const saveSearch = async () => {
    if (!searchName.trim()) {
      toast({ title: 'Please enter a name', variant: 'destructive' });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: user.id,
        search_name: searchName,
        filters: currentFilters
      });

    if (error) {
      toast({ title: 'Failed to save search', variant: 'destructive' });
    } else {
      toast({ title: 'Search saved successfully' });
      setSearchName('');
      setOpen(false);
      loadSavedSearches();
    }
  };

  const deleteSearch = async (id: string) => {
    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', id);

    if (!error) {
      toast({ title: 'Search deleted' });
      loadSavedSearches();
    }
  };

  return (
    <div className="space-y-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Bookmark className="w-4 h-4 mr-2" />
            Save Current Search
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Button onClick={saveSearch} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {savedSearches.length > 0 && (
        <div className="space-y-2 mt-4">
          <h3 className="font-semibold text-sm">Saved Searches</h3>
          {savedSearches.map((search) => (
            <div key={search.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <button
                onClick={() => onLoadSearch(search.filters)}
                className="text-sm hover:text-pink-600 flex-1 text-left"
              >
                {search.search_name}
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteSearch(search.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
