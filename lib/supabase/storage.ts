import { supabaseBrowserClient } from './client';

export async function uploadPropertyImage(file: File, propertyId?: string): Promise<string> {
  const supabase = supabaseBrowserClient;
  
  // Create a unique file path: propertyId/timestamp_filename
  // If no propertyId (e.g., new property), use a temp id or 'new' folder.
  const folder = propertyId || 'new';
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('property-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from('property-images')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
