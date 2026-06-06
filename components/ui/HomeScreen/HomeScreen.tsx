'use client';

import { useState, useMemo } from 'react';
import { Property } from '@/types/property';
import { Navbar } from '@/components/ui/Navbar';
import { FeaturedCard } from '@/components/ui/FeaturedCard';
import { PropertyCard } from '@/components/ui/PropertyCard';

interface HomeScreenProps {
  initialProperties: Property[];
}

type PropertyType = 'all' | 'house' | 'apartment' | 'villa' | 'penthouse';
type PurposeType = 'all' | 'buy' | 'rent';

export function HomeScreen({ initialProperties }: HomeScreenProps) {
  // Use initialProperties as the data source (read-only list for filtering)
  const properties = initialProperties;

  // Favorites list tracking (using set of IDs)
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Filters state
  const [selectedType, setSelectedType] = useState<PropertyType>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeType>('all');
  const [searchInput, setSearchInput] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  
  // Load more simulation
  const [visibleLimit, setVisibleLimit] = useState(6);

  // Toggle favorite handler
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Search handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchQuery(searchInput);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    // Real-time filtering makes it feel premium
    setActiveSearchQuery(value);
  };

  // Filter properties
  const filteredFeatured = useMemo(() => {
    return properties.filter((prop) => {
      if (!prop.isFeatured) return false;
      
      // Filter by type
      if (selectedType !== 'all' && prop.type !== selectedType) return false;
      
      // Filter by search query
      if (activeSearchQuery) {
        const query = activeSearchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesLocation = prop.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation) return false;
      }
      
      return true;
    });
  }, [properties, selectedType, activeSearchQuery]);

  const filteredStandard = useMemo(() => {
    return properties.filter((prop) => {
      if (prop.isFeatured) return false;

      // Filter by type
      if (selectedType !== 'all' && prop.type !== selectedType) return false;

      // Filter by purpose (buy/rent)
      if (selectedPurpose !== 'all' && prop.purpose !== selectedPurpose) return false;

      // Filter by search query
      if (activeSearchQuery) {
        const query = activeSearchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesLocation = prop.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation) return false;
      }

      return true;
    });
  }, [properties, selectedType, selectedPurpose, activeSearchQuery]);

  // Handle load more
  const handleLoadMore = () => {
    setVisibleLimit((prev) => prev + 4);
  };

  // Sync active purpose from Navbar clicks
  const handleNavbarTabChange = (tab: 'all' | 'buy' | 'rent') => {
    setSelectedPurpose(tab);
  };

  // Get responsive classes to match HTML grid layout
  const getResponsiveClass = (index: number) => {
    if (index === 4) return 'hidden xl:flex';
    if (index === 5) return 'hidden lg:flex';
    return 'flex';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased selection:bg-mosque selection:text-white">
      {/* Dynamic Navbar */}
      <Navbar currentTab={selectedPurpose} onTabChange={handleNavbarTabChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark dark:text-white leading-tight">
              Find your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium">sanctuary</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
              </span>.
            </h1>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
                  search
                </span>
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                className="block w-full pl-12 pr-28 py-4 rounded-xl border-none bg-white dark:bg-white/5 text-nordic-dark dark:text-white shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white dark:focus:bg-white/10 transition-all text-lg focus:outline-none"
                placeholder="Search by city, neighborhood, or address..."
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Property Types Tabs */}
            <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
              {(['all', 'house', 'apartment', 'villa', 'penthouse'] as PropertyType[]).map((type) => {
                const isActive = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => { setSelectedType(type); setVisibleLimit(6); }}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium cursor-pointer ${
                      isActive
                        ? 'bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10 transition-transform hover:-translate-y-0.5'
                        : 'bg-white dark:bg-white/5 border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 transition-all hover:bg-mosque/5'
                    }`}
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                );
              })}

              <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
              <button className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark dark:text-gray-300 font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <span className="material-icons text-base">tune</span> Filters
              </button>
            </div>
          </div>
        </section>

        {/* Featured Collections Section */}
        {filteredFeatured.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-light text-nordic-dark dark:text-white">Featured Collections</h2>
                <p className="text-nordic-muted mt-1 text-sm">Curated properties for the discerning eye.</p>
              </div>
              <a className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity" href="#">
                View all <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredFeatured.slice(0, 2).map((property) => (
                <FeaturedCard
                  key={property.id}
                  property={property}
                  isFavorite={favorites.has(property.id)}
                  onToggleFavorite={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(property.id);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* New in Market Section */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark dark:text-white">New in Market</h2>
              <p className="text-nordic-muted mt-1 text-sm">Fresh opportunities added this week.</p>
            </div>
            <div className="hidden md:flex bg-white dark:bg-white/5 p-1 rounded-lg">
              {(['all', 'buy', 'rent'] as PurposeType[]).map((purpose) => {
                const isActive = selectedPurpose === purpose;
                return (
                  <button
                    key={purpose}
                    onClick={() => { setSelectedPurpose(purpose); setVisibleLimit(6); }}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-nordic-dark text-white shadow-sm'
                        : 'text-nordic-muted hover:text-nordic-dark dark:hover:text-white'
                    }`}
                  >
                    {purpose === 'all' ? 'All' : purpose === 'buy' ? 'Buy' : 'Rent'}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredStandard.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStandard.slice(0, visibleLimit).map((property, index) => (
                  <div key={property.id} className={getResponsiveClass(index)}>
                    <PropertyCard
                      property={property}
                      isFavorite={favorites.has(property.id)}
                      onToggleFavorite={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(property.id);
                      }}
                    />
                  </div>
                ))}
              </div>

              {filteredStandard.length > visibleLimit && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 hover:border-mosque hover:text-mosque text-nordic-dark dark:text-white font-medium rounded-lg transition-all hover:shadow-md cursor-pointer"
                  >
                    Load more properties
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-white/5 rounded-xl border border-dashed border-nordic-dark/10 dark:border-white/10">
              <span className="material-icons text-4xl text-nordic-muted mb-2">info_outline</span>
              <p className="text-nordic-muted">No properties found matching your criteria.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
