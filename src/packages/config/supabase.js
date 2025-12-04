// Supabase configuration for React Native/Expo
// ============================================
// SETUP INSTRUCTIONS:
// 1. Go to your Supabase project dashboard: https://app.supabase.com
// 2. Navigate to Settings > API
// 3. Copy your "anon public" key and paste it below
// 4. Make sure your storage bucket name matches STORAGE_BUCKETS below
// ============================================

const SUPABASE_URL = 'https://gfckrsileizyfyawanvh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0B5QgPMty4Ii5XIUP2F-4Q_uDSxqV3O';

// Supabase client is in a separate file to avoid Expo Go bundling issues
// Import it only when needed (for auth, database operations)
// Images use direct URLs and don't need the client
export { getSupabaseClient } from './supabaseClient';

// Export constants for direct use
export { SUPABASE_URL, SUPABASE_ANON_KEY };

// Storage bucket names
// ============================================
// IMPORTANT: Make sure these bucket names match your Supabase Storage buckets
// To check/create buckets: Go to Storage in your Supabase dashboard
// ============================================
export const STORAGE_BUCKETS = {
  CAR_IMAGES: 'carimages', // Change if your bucket name is different
  CAR_VIDEOS: 'carvideos',
  PROFILE_IMAGES: 'profileimages',
  DOCUMENTS: 'documents',
};

// Helper function to get public URL for a storage file
// Direct URL construction works in both Expo Go and development builds
export const getStorageUrl = (bucket, path) => {
  // Construct public URL directly - works in Expo Go
  // Format: https://{project-ref}.supabase.co/storage/v1/object/public/{bucket}/{path}
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${cleanPath}`;
};

// Helper function to get signed URL for a storage file (for private files)
// Requires Supabase client - only works in development builds
export const getSignedUrl = async (bucket, path, expiresIn = 3600) => {
  const { getSupabaseClient } = await import('./supabaseClient');
  const client = await getSupabaseClient();
  if (!client) {
    console.warn('Supabase client not available. Returning public URL instead.');
    return getStorageUrl(bucket, path);
  }
  
  const { data, error } = await client.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }
  return data.signedUrl;
};

