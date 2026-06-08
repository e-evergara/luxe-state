'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Property } from '@/types/property';
import { Navbar } from '@/components/ui/Navbar';
import { FeaturedCard } from '@/components/ui/FeaturedCard';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface HomeScreenProps {
  // Paginated standard properties
  properties: Property[];
  totalPages: number;
  currentPage: number;
  // Featured (not paginated)
  featuredProperties: Property[];
  // Active filter values (from URL, parsed by server)
  activeType: string;
  activePurpose: string;
  activeSearch: string;
}

type PropertyType = 'all' | 'house' | 'apartment' | 'villa' | 'penthouse';
type PurposeType = 'all' | 'buy' | 'rent';

export function HomeScreen({
  properties,
  totalPages,
  currentPage,
  featuredProperties,
  activeType,
  activePurpose,
  activeSearch,
}: HomeScreenProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  // -------------------------------------------------------------------------
  // URL param helpers
  // -------------------------------------------------------------------------

  /** Build a new URL preserving existing params, then pushing a new one */
  const buildUrl = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Reset to page 1 on any filter change
      params.delete('page');
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams],
  );

  const handleTypeChange = (type: PropertyType) => {
    router.push(buildUrl({ type }));
  };

  const handlePurposeChange = (purpose: PurposeType) => {
    router.push(buildUrl({ purpose }));
  };

  const handleNavbarTabChange = (tab: 'all' | 'buy' | 'rent') => {
    router.push(buildUrl({ purpose: tab }));
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const search = (fd.get('search') as string) ?? '';
    router.push(buildUrl({ search }));
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased selection:bg-mosque selection:text-white">
      {/* Dynamic Navbar */}
      <Navbar
        currentTab={activePurpose as PurposeType}
        onTabChange={handleNavbarTabChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark dark:text-white leading-tight">
              {t('home.heroTitlePrefix')}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium">{t('home.heroTitleHighlight')}</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
              </span>
              {t('home.heroTitleSuffix')}
            </h1>

            {/* Search Input Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative group max-w-2xl mx-auto"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
                  search
                </span>
              </div>
              <input
                type="text"
                name="search"
                defaultValue={activeSearch}
                key={activeSearch} /* re-mount when server updates value */
                className="block w-full pl-12 pr-28 py-4 rounded-xl border-none bg-white dark:bg-white/5 text-nordic-dark dark:text-white shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white dark:focus:bg-white/10 transition-all text-lg focus:outline-none"
                placeholder={t('home.searchPlaceholder')}
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer"
              >
                {t('home.searchButton')}
              </button>
            </form>

            {/* Property Types Tabs */}
            <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
              {(
                ['all', 'house', 'apartment', 'villa', 'penthouse'] as PropertyType[]
              ).map((type) => {
                const isActive = activeType === type;
                return (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium cursor-pointer ${
                      isActive
                        ? 'bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10 transition-transform hover:-translate-y-0.5'
                        : 'bg-white dark:bg-white/5 border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 transition-all hover:bg-mosque/5'
                    }`}
                  >
                    {t(`home.types.${type}`)}
                  </button>
                );
              })}

              <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
              <button className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark dark:text-gray-300 font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <span className="material-icons text-base">tune</span> {t('home.filters')}
              </button>
            </div>
          </div>
        </section>

        {/* Featured Collections Section */}
        {featuredProperties.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-light text-nordic-dark dark:text-white">
                  {t('home.featuredTitle')}
                </h2>
                <p className="text-nordic-muted mt-1 text-sm">
                  {t('home.featuredSubtitle')}
                </p>
              </div>
              <a
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
                href="#"
              >
                {t('home.viewAll')}{' '}
                <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProperties.slice(0, 2).map((property) => (
                <FeaturedCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )}

        {/* New in Market Section */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark dark:text-white">
                {t('home.newMarketTitle')}
              </h2>
              <p className="text-nordic-muted mt-1 text-sm">
                {t('home.newMarketSubtitle')}
              </p>
            </div>
            <div className="hidden md:flex bg-white dark:bg-white/5 p-1 rounded-lg">
              {(['all', 'buy', 'rent'] as PurposeType[]).map((purpose) => {
                const isActive = activePurpose === purpose;
                return (
                  <button
                    key={purpose}
                    onClick={() => handlePurposeChange(purpose)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-nordic-dark text-white shadow-sm'
                        : 'text-nordic-muted hover:text-nordic-dark dark:hover:text-white'
                    }`}
                  >
                    {t(`home.purposes.${purpose}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Server-side Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-white/5 rounded-xl border border-dashed border-nordic-dark/10 dark:border-white/10">
              <span className="material-icons text-4xl text-nordic-muted mb-2">
                info_outline
              </span>
              <p className="text-nordic-muted">
                {t('home.emptyState')}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
