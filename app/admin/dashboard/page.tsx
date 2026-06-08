import type { Metadata } from 'next';
import { getAllPropertiesAdmin, getAllUserRoles } from '@/lib/supabase/queries';
import { AdminDashboard } from '@/components/ui/AdminDashboard/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard — LuxeEstate',
  description: 'Manage properties and users on LuxeEstate.',
};

interface AdminDashboardPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = await searchParams;
  const tab = params.tab === 'users' ? 'users' : 'properties';

  const [properties, userRoles] = await Promise.all([
    getAllPropertiesAdmin(),
    getAllUserRoles(),
  ]);

  return <AdminDashboard properties={properties} userRoles={userRoles} activeTab={tab} />;
}
