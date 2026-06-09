'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateUserRole } from '@/lib/supabase/queries';
import { UserRole } from '@/types/user';
import { Property } from '@/types/property';

export interface SavePropertyInput {
  title: string;
  price: number;
  status: Property['status'];
  type: Property['type'];
  purpose: Property['purpose'];
  location: string;
  area: number;
  beds: number;
  baths: number;
  tag?: string | null;
  isFeatured: boolean;
  active: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

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

export async function savePropertyAction(
  propertyData: SavePropertyInput,
  imagesData: { url: string }[],
  propertyId?: string
): Promise<{ success: boolean; propertyId?: string; error?: string }> {
  try {
    // 1. Verify the caller is an authenticated admin using the regular (anon) client.
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const callerRole = (user.app_metadata as { role?: string } | undefined)?.role;
    if (callerRole !== 'admin') {
      return { success: false, error: 'Unauthorized: admin role required.' };
    }

    // 2. Use the admin client (service role key) for all write operations
    //    so they bypass RLS policies on properties and property_images.
    const adminSupabase = createAdminClient();

    let savedPropertyId = propertyId;

    if (propertyId) {
      // Update existing property
      const { error: propError } = await adminSupabase
        .from('properties')
        .update({
          title: propertyData.title,
          location: propertyData.location,
          price: propertyData.price,
          beds: propertyData.beds,
          baths: propertyData.baths,
          area: propertyData.area,
          tag: propertyData.tag || null,
          type: propertyData.type,
          purpose: propertyData.purpose,
          is_featured: propertyData.isFeatured,
          active: propertyData.active,
          status: propertyData.status,
          latitude: propertyData.latitude,
          longitude: propertyData.longitude,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', propertyId);

      if (propError) throw propError;
    } else {
      // Create new property
      const randomStr = Math.random().toString(36).substring(2, 10);
      const newId = `prop-${randomStr}`;
      const { data, error: propError } = await adminSupabase
        .from('properties')
        .insert({
          id: newId,
          title: propertyData.title,
          location: propertyData.location,
          price: propertyData.price,
          beds: propertyData.beds,
          baths: propertyData.baths,
          area: propertyData.area,
          tag: propertyData.tag || null,
          type: propertyData.type,
          purpose: propertyData.purpose,
          is_featured: propertyData.isFeatured,
          active: propertyData.active,
          status: propertyData.status,
          latitude: propertyData.latitude,
          longitude: propertyData.longitude,
          created_by: user.id,
        })
        .select()
        .single();

      if (propError) throw propError;
      savedPropertyId = data.id;
    }

    // 3. Sync images: delete existing ones then re-insert.
    if (propertyId) {
      await adminSupabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId);
    }

    if (imagesData && imagesData.length > 0) {
      const imagesToInsert = imagesData.map((img, index) => ({
        property_id: savedPropertyId,
        url: img.url,
        sort_order: index,
        status: 'active',
        created_by: user.id,
      }));

      const { error: imgError } = await adminSupabase
        .from('property_images')
        .insert(imagesToInsert);

      if (imgError) throw imgError;
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/properties');
    revalidatePath(`/admin/properties/${savedPropertyId}`);

    return { success: true, propertyId: savedPropertyId };
  } catch (err: unknown) {
    console.error('Error saving property:', err);
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Server Action to toggle the `active` field of a property.
 * Updates only the active column for efficiency.
 */
export async function togglePropertyActiveAction(
  propertyId: string,
  active: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const callerRole = (user.app_metadata as { role?: string } | undefined)?.role;
    if (callerRole !== 'admin') {
      return { success: false, error: 'Unauthorized: admin role required.' };
    }

    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase
      .from('properties')
      .update({
        active,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', propertyId);

    if (error) throw error;

    revalidatePath('/admin/dashboard');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    console.error('Error toggling property active state:', err);
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
