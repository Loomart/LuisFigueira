import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isDev = import.meta.env.DEV;

let supabaseInstance;

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  if (isDev) {
    console.warn('⚠️ Supabase credentials not found in environment variables. Auth and DB features will be disabled.');
    const mockQueryBuilder = () => {
      const builder = {
        select: () => builder,
        insert: () => Promise.reject(new Error("Base de datos no conectada.")),
        update: () => builder,
        eq: () => builder,
        single: () => Promise.resolve({ data: null, error: { message: "Base de datos no conectada" } }),
        order: () => Promise.resolve({ data: [], error: { message: "Base de datos no conectada" } }),
      };
      return builder;
    };

    supabaseInstance = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: () => Promise.reject(new Error("Supabase no está configurado localmente.")),
        signInWithPassword: () => Promise.reject(new Error("Supabase no está configurado localmente.")),
        signOut: () => Promise.resolve(),
      },
      from: () => mockQueryBuilder()
    };
  } else {
    throw new Error("Faltan credenciales de Supabase. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
  }
}

export const supabase = supabaseInstance;
