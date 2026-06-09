import { PropertyForm } from '@/components/ui/AdminDashboard/PropertyForm';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Property — LuxeEstate Admin',
};

export default function NewPropertyPage() {
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
                Add New
              </li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#19322F] tracking-tight mb-2">
              Add New Property
            </h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
              Fill in the details below to create a new listing. Fields marked with * are mandatory.
            </p>
          </div>
        </div>
      </header>

      <PropertyForm />
    </main>
  );
}
