import { createServerClient } from './server';
import { Property, PropertyImage, PaginatedResult } from '@/types/property';
import { UserRole, UserRoleRecord } from '@/types/user';

export const PAGE_SIZE = 8;

// ---------------------------------------------------------------------------
// Type helpers for raw Supabase rows
// ---------------------------------------------------------------------------

interface PropertyImageRow {
  id: string;
  property_id: string;
  url: string;
  title: string | null;
  description: string | null;
  sort_order: number;
  status: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
}

interface PropertyRow {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  tag: string | null;
  type: string;
  purpose: string;
  is_featured: boolean;
  active: boolean;
  status: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  latitude: number | null;
  longitude: number | null;
  property_images: PropertyImageRow[];
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapImage(row: PropertyImageRow): PropertyImage {
  return {
    id: row.id,
    propertyId: row.property_id,
    url: row.url,
    title: row.title ?? undefined,
    description: row.description ?? undefined,
    sortOrder: row.sort_order,
    status: row.status as PropertyImage['status'],
    createdAt: row.created_at,
    createdBy: row.created_by ?? undefined,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by ?? undefined,
  };
}

function mapProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: row.price,
    beds: row.beds,
    baths: row.baths,
    area: row.area,
    tag: row.tag ?? undefined,
    type: row.type as Property['type'],
    purpose: row.purpose as Property['purpose'],
    isFeatured: row.is_featured,
    active: row.active,
    status: row.status as Property['status'],
    images: (row.property_images ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapImage),
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    createdAt: row.created_at,
    createdBy: row.created_by ?? undefined,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Query params interface
// ---------------------------------------------------------------------------

export interface GetPropertiesParams {
  page?: number;
  type?: string;
  purpose?: string;
  search?: string;
  featured?: boolean;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Fetches a paginated list of non-featured properties with optional filters.
 * Server-side only — uses the server Supabase client.
 */
export async function getProperties(
  params: GetPropertiesParams = {},
): Promise<PaginatedResult<Property>> {
  const supabase = await createServerClient();
  const { page = 1, type, purpose, search } = params;

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Build query for count
  let countQuery = supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('is_featured', false)
    .eq('active', true);

  // Build query for data
  let dataQuery = supabase
    .from('properties')
    .select(
      `
      id, title, location, price, beds, baths, area, tag, type, purpose,
      is_featured, active, status, created_at, created_by, updated_at, updated_by,
      latitude, longitude,
      property_images (
        id, property_id, url, title, description, sort_order,
        status, created_at, created_by, updated_at, updated_by
      )
      `,
    )
    .eq('is_featured', false)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  // Apply filters
  if (type && type !== 'all') {
    countQuery = countQuery.eq('type', type);
    dataQuery = dataQuery.eq('type', type);
  }
  if (purpose && purpose !== 'all') {
    countQuery = countQuery.eq('purpose', purpose);
    dataQuery = dataQuery.eq('purpose', purpose);
  }
  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    countQuery = countQuery.or(`title.ilike.${term},location.ilike.${term}`);
    dataQuery = dataQuery.or(`title.ilike.${term},location.ilike.${term}`);
  }

  const [{ count, error: countError }, { data, error: dataError }] =
    await Promise.all([countQuery, dataQuery]);

  if (countError) throw new Error(countError.message);
  if (dataError) throw new Error(dataError.message);

  const total = count ?? 0;

  return {
    data: (data as PropertyRow[]).map(mapProperty),
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

/**
 * Fetches featured properties with optional type / search filters.
 * Not paginated — always returns a curated list (max 6).
 */
export async function getFeaturedProperties(
  params: Pick<GetPropertiesParams, 'type' | 'search'> = {},
): Promise<Property[]> {
  const supabase = await createServerClient();
  const { type, search } = params;

  let query = supabase
    .from('properties')
    .select(
      `
      id, title, location, price, beds, baths, area, tag, type, purpose,
      is_featured, active, status, created_at, created_by, updated_at, updated_by,
      latitude, longitude,
      property_images (
        id, property_id, url, title, description, sort_order,
        status, created_at, created_by, updated_at, updated_by
      )
      `,
    )
    .eq('is_featured', true)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (type && type !== 'all') {
    query = query.eq('type', type);
  }
  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`title.ilike.${term},location.ilike.${term}`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return (data as PropertyRow[]).map(mapProperty);
}

// ---------------------------------------------------------------------------
// Admin-only type helpers
// ---------------------------------------------------------------------------

interface UserRoleRow {
  user_id: string;
  role: string;
  created_at: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  last_sign_in_at: string | null;
}

// ---------------------------------------------------------------------------
// Admin queries — use SECURITY DEFINER RPCs via the regular server client.
// No service role key needed. The DB functions enforce the admin check.
// ---------------------------------------------------------------------------

/**
 * Fetches all user roles joined with user metadata via a SECURITY DEFINER RPC.
 * Only returns data if the calling user is an admin (enforced in the DB function).
 */
export async function getAllUserRoles(): Promise<UserRoleRecord[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.rpc('get_all_user_roles_for_admin');

  if (error) throw new Error(error.message);

  return (data as UserRoleRow[]).map((row) => ({
    userId: row.user_id,
    role: row.role as UserRole,
    createdAt: row.created_at,
    email: row.email ?? undefined,
    displayName: row.display_name ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    lastSignInAt: row.last_sign_in_at ?? undefined,
  }));
}

/**
 * Updates a user's role via a SECURITY DEFINER RPC.
 * Only works if the calling user is an admin (enforced in the DB function).
 */
export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<void> {
  const supabase = await createServerClient();

  const { error } = await supabase.rpc('admin_update_user_role', {
    p_user_id: userId,
    p_role: role,
  });

  if (error) throw new Error(error.message);
}

/**
 * Fetches ALL properties (featured + non-featured) for the admin dashboard.
 * Uses the regular server client — properties are readable with the anon key.
 */
export async function getAllPropertiesAdmin(): Promise<Property[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('properties')
    .select(
      `
      id, title, location, price, beds, baths, area, tag, type, purpose,
      is_featured, active, status, created_at, created_by, updated_at, updated_by,
      latitude, longitude,
      property_images (
        id, property_id, url, title, description, sort_order,
        status, created_at, created_by, updated_at, updated_by
      )
      `,
    )
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data as PropertyRow[]).map(mapProperty);
}

/**
 * Fetches a single property by ID, including its images.
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('properties')
    .select(
      `
      id, title, location, price, beds, baths, area, tag, type, purpose,
      is_featured, active, status, created_at, created_by, updated_at, updated_by,
      latitude, longitude,
      property_images (
        id, property_id, url, title, description, sort_order,
        status, created_at, created_by, updated_at, updated_by
      )
      `,
    )
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(error.message);
  }

  return mapProperty(data as PropertyRow);
}
