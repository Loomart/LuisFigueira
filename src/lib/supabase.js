import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isDev = import.meta.env.DEV;
const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabaseInstance;

if (supabaseConfigured) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  const makeStubQueryBuilder = () => {
    const builder = {
      select: () => builder,
      update: () => builder,
      eq: () => builder,
      single: () => Promise.resolve({ data: null, error: { message: "Servicio no disponible" } }),
      order: () => Promise.resolve({ data: [], error: { message: "Servicio no disponible" } }),
      insert: () => Promise.reject(new Error("Servicio no disponible")),
    };
    return builder;
  };

  if (isDev) {
    console.warn('⚠️ Supabase no configurado. Usando stub solo en desarrollo.');
  }

  supabaseInstance = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.reject(new Error("Servicio no disponible")),
      signInWithPassword: () => Promise.reject(new Error("Servicio no disponible")),
      signOut: () => Promise.resolve(),
    },
    from: () => makeStubQueryBuilder()
  };
}

export const supabase = supabaseInstance;
export { supabaseConfigured };
