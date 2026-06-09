'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { updateUserRole } from '@/lib/supabase/queries';
import { UserRole } from '@/types/user';

/**
 * Server Action to update a user's role.
 * Validates that the caller is an admin before proceeding.
 */
export async function updateUserRoleAction(
  userId: string,
  role: UserRole,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify the caller is an authenticated admin
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized: not authenticated.' };
    }

    const callerRole = (user.app_metadata as { role?: string } | undefined)
      ?.role;

    if (callerRole !== 'admin') {
      return { success: false, error: 'Unauthorized: admin role required.' };
    }

    await updateUserRole(userId, role);
    revalidatePath('/admin/dashboard');

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
