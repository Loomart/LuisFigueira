
-- Permitir a los administradores ver TODOS los perfiles
create policy "Admins pueden ver todos los perfiles"
on public.profiles for select
using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

-- Permitir a los administradores actualizar cualquier perfil
create policy "Admins pueden actualizar cualquier perfil"
on public.profiles for update
using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);
