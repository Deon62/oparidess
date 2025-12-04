// Supabase client - only imported when needed (for auth, database)
// This file is separate to avoid Expo Go bundling issues
// Images use direct URLs and don't need this client

const SUPABASE_URL = 'https://gfckrsileizyfyawanvh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0B5QgPMty4Ii5XIUP2F-4Q_uDSxqV3O';

let _supabaseClient = null;

export const getSupabaseClient = async () => {
  if (_supabaseClient) {
    return _supabaseClient;
  }

  try {
    await import('expo-sqlite/localStorage/install');
    const { createClient } = await import('@supabase/supabase-js');
    const localStorage = await import('expo-sqlite/localStorage');

    _supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

    return _supabaseClient;
  } catch (error) {
    console.warn('Supabase client not available in Expo Go. Use a development build for auth features.', error);
    return null;
  }
};

