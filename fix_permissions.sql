
-- EJECUTA ESTO EN EL SQL EDITOR DE SUPABASE PARA SOLUCIONAR EL ERROR

-- 1. Permitir que tu usuario pueda CREAR su propio perfil (esto faltaba)
create policy "Usuarios pueden crear su perfil"
on public.profiles for insert
with check ( auth.uid() = id );

-- 2. Asegurarnos de que pueden actualizarlo
drop policy if exists "Usuarios pueden actualizar su propio perfil" on public.profiles;

create policy "Usuarios pueden actualizar su propio perfil"
on public.profiles for update
using ( auth.uid() = id );
