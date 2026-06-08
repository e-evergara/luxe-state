import { Suspense } from 'react';
import { HomeScreen } from '@/components/ui/HomeScreen';
import { getProperties, getFeaturedProperties } from '@/lib/supabase/queries';

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
    purpose?: string;
    search?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page ?? 1));
  const type = params.type ?? 'all';
  const purpose = params.purpose ?? 'all';
  const search = params.search ?? '';

  // Fetch standard + featured properties in parallel from Supabase
  const [paginatedResult, featuredProperties] = await Promise.all([
    getProperties({ page, type, purpose, search }),
    getFeaturedProperties({ type, search }),
  ]);

  return (
    <Suspense>
      <HomeScreen
        properties={paginatedResult.data}
        totalPages={paginatedResult.totalPages}
        currentPage={paginatedResult.page}
        featuredProperties={featuredProperties}
        activeType={type}
        activePurpose={purpose}
        activeSearch={search}
      />
    </Suspense>
  );
}
