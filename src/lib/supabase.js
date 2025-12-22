import { createClient } from '@supabase/supabase-js';

// Usamos las variables de entorno de Vite (empiezan por VITE_)
// Si no están definidas (ej: en local sin .env), usamos strings vacíos para evitar crash
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
