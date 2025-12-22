import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('⚠️ Supabase credentials not found in environment variables. Auth and DB features will be disabled.');
  
  // Mock Supabase client to prevent crash
  supabaseInstance = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.reject(new Error("Supabase no está configurado localmente.")),
      signInWithPassword: () => Promise.reject(new Error("Supabase no está configurado localmente.")),
      signOut: () => Promise.resolve(),
    },
    from: () => ({
      select: () => ({
        order: () => Promise.reject(new Error("Base de datos no conectada."))
      }),
      insert: () => Promise.reject(new Error("Base de datos no conectada."))
    })
  };
}

export const supabase = supabaseInstance;
