import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/ui/AdminDashboard/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for all /admin/* routes.
 * Secondary guard after middleware — verifies the user is an admin
 * at the server component level before rendering any admin content.
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const role = (user.app_metadata as { role?: string } | undefined)?.role;

  if (role !== 'admin') {
    redirect('/');
  }

  const displayName =
    (user.user_metadata as { full_name?: string } | undefined)?.full_name ??
    user.email ??
    'Admin';

  const avatarUrl = (
    user.user_metadata as { avatar_url?: string } | undefined
  )?.avatar_url;

  return (
    <div className="min-h-screen bg-[#EEF6F6] dark:bg-[#0f231f] flex">
      <Suspense fallback={<div className="w-64 bg-[#19322F] h-full" />}>
        <AdminSidebar displayName={displayName} avatarUrl={avatarUrl} />
      </Suspense>
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
