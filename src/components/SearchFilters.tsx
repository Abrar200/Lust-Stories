import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { SearchingOverlay } from './SearchingOverlay';

const WORKER_TYPES = ['Stripper', 'Sugar baby', 'Escort'];
const AGE_RANGES = ['18-29', '30-39', '40-49', '50+'];
const ETHNICITIES = ['Caucasian', 'Hispanic/Latina', 'European', 'African', 'Asian'];
const RATING_OPTIONS = ['High to Low', 'Top Rated'];
const PRICE_OPTIONS = ['High to Low'];
const SEX_OPTIONS = ['Female', 'Male', 'Trans Female', 'Trans Male'];
const SEXUALITY_OPTIONS = ['Heterosexual', 'Bisexual', 'Homosexual'];

interface SearchFiltersProps {
  filters: any;
  onFilterChange: (filters: any) => void;
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const [isSearching, setIsSearching] = useState(false);

  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const handleApply = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <>
      <SearchingOverlay isVisible={isSearching} />
      <div className="space-y-6 p-4">
        <h3 className="text-lg font-bold text-gray-900">Filter</h3>
        <Separator className="bg-gray-200" />
        <div>
          <Label className="mb-3 block text-sm font-semibold text-gray-900">Worker</Label>
          <RadioGroup value={filters.workerType || ''} onValueChange={(v) => updateFilter('workerType', v)}>
            <div className="space-y-2">
              {WORKER_TYPES.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <RadioGroupItem value={type} id={`worker-${type}`} className="border-gray-300 text-pink-600" />
                  <label htmlFor={`worker-${type}`} className="text-sm text-gray-700 cursor-pointer">{type}</label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        <Separator className="bg-gray-200" />
        <div>
          <Label className="mb-3 block text-sm font-semibold text-gray-900">Age</Label>
          <RadioGroup value={filters.ageRange || ''} onValueChange={(v) => updateFilter('ageRange', v)}>
            <div className="space-y-2">
              {AGE_RANGES.map((range) => (
                <div key={range} className="flex items-center gap-2">
                  <RadioGroupItem value={range} id={`age-${range}`} className="border-gray-300 text-pink-600" />
                  <label htmlFor={`age-${range}`} className="text-sm text-gray-700 cursor-pointer">{range}</label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        <Separator className="bg-gray-200" />
        <div>
          <Label className="mb-3 block text-sm font-semibold text-gray-900">Ethnicity</Label>
          <RadioGroup value={filters.ethnicity || ''} onValueChange={(v) => updateFilter('ethnicity', v)}>
            <div className="space-y-2">
              {ETHNICITIES.map((ethnicity) => (
                <div key={ethnicity} className="flex items-center gap-2">
                  <RadioGroupItem value={ethnicity} id={`eth-${ethnicity}`} className="border-gray-300 text-pink-600" />
                  <label htmlFor={`eth-${ethnicity}`} className="text-sm text-gray-700 cursor-pointer">{ethnicity}</label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <Separator className="bg-gray-200" />
        <div>
          <Label className="mb-3 block text-sm font-semibold text-gray-900">Rating</Label>
          <RadioGroup value={filters.rating || ''} onValueChange={(v) => updateFilter('rating', v)}>
            <div className="space-y-2">
              {RATING_OPTIONS.map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <RadioGroupItem value={rating} id={`rating-${rating}`} className="border-gray-300 text-pink-600" />
                  <label htmlFor={`rating-${rating}`} className="text-sm text-gray-700 cursor-pointer">{rating}</label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        <Separator className="bg-gray-200" />
        <div>
          <Label className="mb-3 block text-sm font-semibold text-gray-900">Price</Label>
          <RadioGroup value={filters.price || ''} onValueChange={(v) => updateFilter('price', v)}>
            <div className="space-y-2">
              {PRICE_OPTIONS.map((price) => (
                <div key={price} className="flex items-center gap-2">
                  <RadioGroupItem value={price} id={`price-${price}`} className="border-gray-300 text-pink-600" />
                  <label htmlFor={`price-${price}`} className="text-sm text-gray-700 cursor-pointer">{price}</label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        <Separator className="bg-gray-200" />
        <div>
          <Label className="mb-3 block text-sm font-semibold text-gray-900">Sex</Label>
          <RadioGroup value={filters.sex || ''} onValueChange={(v) => updateFilter('sex', v)}>
            <div className="space-y-2">
              {SEX_OPTIONS.map((sex) => (
                <div key={sex} className="flex items-center gap-2">
                  <RadioGroupItem value={sex} id={`sex-${sex}`} className="border-gray-300 text-pink-600" />
                  <label htmlFor={`sex-${sex}`} className="text-sm text-gray-700 cursor-pointer">{sex}</label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        <Separator className="bg-gray-200" />
        <div>
          <Label className="mb-3 block text-sm font-semibold text-gray-900">Sexuality</Label>
          <RadioGroup value={filters.sexuality || ''} onValueChange={(v) => updateFilter('sexuality', v)}>
            <div className="space-y-2">
              {SEXUALITY_OPTIONS.map((sexuality) => (
                <div key={sexuality} className="flex items-center gap-2">
                  <RadioGroupItem value={sexuality} id={`sex-${sexuality}`} className="border-gray-300 text-pink-600" />
                  <label htmlFor={`sex-${sexuality}`} className="text-sm text-gray-700 cursor-pointer">{sexuality}</label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-3 pt-4">
          <Button 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-5"
            onClick={handleApply}
          >
            Apply
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-5"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        </div>
      </div>
    </>
  );
}
