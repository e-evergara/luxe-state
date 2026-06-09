import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export interface SearchSuggestion {
  id: string;
  title: string;
  location: string;
  city?: string;
  zipCode?: string;
  type: string;
  purpose: string;
}

/**
 * GET /api/search-suggestions?q=<query>&limit=<n>
 * Returns up to `limit` (default 6) lightweight property suggestions
 * matching title, location, city, or zip_code — case-insensitively.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q')?.trim() ?? '';
  const limit = Math.min(Number(searchParams.get('limit') ?? 6), 12);

  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const supabase = await createServerClient();
  const term = `%${q}%`;
  const quoted = `"${term}"`;
  const filter = `title.ilike.${quoted},location.ilike.${quoted},city.ilike.${quoted},zip_code.ilike.${quoted}`;

  const { data, error } = await supabase
    .from('properties')
    .select('id, title, location, city, zip_code, type, purpose')
    .eq('active', true)
    .or(filter)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const suggestions: SearchSuggestion[] = (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    location: row.location as string,
    city: (row.city as string | null) ?? undefined,
    zipCode: (row.zip_code as string | null) ?? undefined,
    type: row.type as string,
    purpose: row.purpose as string,
  }));

  return NextResponse.json({ suggestions });
}
