import { createClient } from '@supabase/supabase-js';

type SupabaseClientType = ReturnType<typeof createClient>;

declare global {
  interface Window {
    __supabase?: SupabaseClientType;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const createSupabaseClient = () =>
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

export const supabase = typeof window !== 'undefined'
  ? (window.__supabase ??= createSupabaseClient() as SupabaseClientType)
  : createSupabaseClient();

// Auth helpers (adapted from your IEEE-Website patterns)
export const signInWithGoogle = async () => {
  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/callback`
    : process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      : process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL ?? '';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// EngiHub specific profile helpers
export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  college: string;
  branch: string;
  year: number;
  semester: number;
  is_pro: boolean;
  ai_uses_today: number;
  created_at: string;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) return null;
  return data as UserProfile;
};

export type SignupPreferences = {
  full_name?: string;
  college?: string;
  branch?: string;
  year?: number;
  semester?: number;
};

export const upsertUserProfile = async (userId: string, profile: SignupPreferences) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      full_name: profile.full_name,
      college: profile.college,
      branch: profile.branch,
      year: profile.year,
      semester: profile.semester,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) throw error;
  return data;
};
