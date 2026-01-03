
-- 1. Eliminar las políticas problemáticas (las que usan subqueries recursivas)
drop policy if exists "Admins pueden ver todos los perfiles" on public.profiles;
drop policy if exists "Admins pueden actualizar cualquier perfil" on public.profiles;

-- 2. Crear una función de seguridad "definer"
-- Esta función se ejecuta con permisos de superusuario, evitando la recursión infinita
-- al consultar la tabla profiles dentro de una política de profiles.
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 3. Crear nuevas políticas usando la función segura
create policy "Admins pueden ver todos los perfiles"
on public.profiles for select
using (
  auth.uid() = id -- Un usuario puede verse a sí mismo
  OR
  public.is_admin() -- O es admin (usando la función segura)
);

create policy "Admins pueden actualizar cualquier perfil"
on public.profiles for update
using (
  auth.uid() = id -- Un usuario puede actualizarse a sí mismo
  OR
  public.is_admin() -- O es admin
);
