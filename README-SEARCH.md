# Advanced Search System

## Overview
Comprehensive search functionality with advanced filtering, location-based search, saved searches, and search history tracking.

## Features

### 1. Full-Text Search
- Search across names, bios, and services
- Real-time filtering as you type
- Powered by PostgreSQL text search capabilities

### 2. Location-Based Search
- Radius filtering (5-100 miles)
- Geographic distance calculations
- City and state filtering

### 3. Advanced Filters
- **Price Range**: Filter by hourly rate (min/max)
- **Service Types**: Multi-select service filtering
- **Rating**: Minimum rating filter (0-5 stars)
- **Availability**: Calendar-based date filtering

### 4. Sorting Options
- Most Recent
- Highest Rated
- Most Reviews
- Price: Low to High
- Price: High to Low
- Distance (when location provided)

### 5. Saved Searches
- Save frequently used search criteria
- Quick load saved searches
- Delete unwanted saved searches
- Stored per user in database

### 6. Search History
- Automatic tracking of all searches
- View recent searches with result counts
- Quick replay of previous searches
- Limited to last 10 searches per user

## Database Setup

Run the SQL in `search-schema.sql` to set up:
- Enhanced user_profiles table with search fields
- Full-text search indexes
- saved_searches table
- search_history table
- Proper RLS policies

## Usage

### Basic Search
```typescript
// Simple text search
<Input 
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search..."
/>
```

### Apply Filters
```typescript
const filters = {
  location: 'Miami',
  latitude: 25.7617,
  longitude: -80.1918,
  radius: 25,
  minPrice: 100,
  maxPrice: 500,
  services: ['Companionship', 'Dinner Date'],
  minRating: 4.5,
  availableDate: new Date('2025-12-01')
};
```

### Save Search
```typescript
await supabase.from('saved_searches').insert({
  user_id: user.id,
  search_name: 'Weekend in Miami',
  filters: filters
});
```

### Load Search History
```typescript
const { data } = await supabase
  .from('search_history')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
  .limit(10);
```

## Components

### SearchFilters
Advanced filter panel with all filter options

### SavedSearches
Manage saved searches (save, load, delete)

### Search (Main)
Complete search interface with:
- Text search bar
- Filter tabs (Filters, Saved, History)
- Sort dropdown
- Results grid
- Real-time filtering

## Distance Calculation
Uses Haversine formula for accurate geographic distance:
```typescript
const distance = calculateDistance(lat1, lon1, lat2, lon2);
// Returns distance in miles
```

## Performance
- Indexed full-text search for fast queries
- Geographic indexes for location queries
- Efficient filtering in frontend
- Automatic search history cleanup (10 most recent)

## Future Enhancements
- Map view integration
- Geocoding for address input
- Advanced availability filtering (time ranges)
- Price history tracking
- Popular searches suggestions
