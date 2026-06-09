import { PropertyForm } from '@/components/ui/AdminDashboard/PropertyForm';
import { getPropertyById } from '@/lib/supabase/queries';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Property — LuxeEstate Admin',
};

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
              <li>
                <Link href="/admin/dashboard?tab=properties" className="hover:text-[#006655] transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <span className="material-icons text-xs text-gray-400">chevron_right</span>
              </li>
              <li aria-current="page" className="text-[#19322F]">
                Edit Property
              </li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#19322F] tracking-tight mb-2">
              Edit Property
            </h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
              Update the details for {property.title}.
            </p>
          </div>
        </div>
      </header>

      <PropertyForm property={property} />
    </main>
  );
}
