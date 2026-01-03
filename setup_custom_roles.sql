
-- 1. Crear tabla de Roles Personalizados (Custom Roles)
create table public.app_roles (
  role_name text primary key,
  label text,
  permissions text[] -- Lista de permisos (ej: ['ver_mensajes', 'borrar_mensajes'])
);

-- 2. Insertar los roles por defecto
insert into public.app_roles (role_name, label, permissions) values
('admin', 'Administrador', array['access_admin_panel', 'view_messages', 'reply_messages', 'delete_messages', 'manage_users', 'view_analytics']),
('support', 'Soporte', array['access_admin_panel', 'view_messages', 'reply_messages']),
('editor', 'Editor', array['access_admin_panel', 'view_analytics']),
('user', 'Usuario', array[]::text[]);

-- 3. Asegurar que la tabla profiles use estos roles
-- (Asumiendo que profiles.role ya existe, le añadimos la relación)
alter table public.profiles 
drop constraint if exists fk_profiles_role;

alter table public.profiles
add constraint fk_profiles_role
foreign key (role) 
references public.app_roles (role_name)
on update cascade;

-- 4. Habilitar acceso de lectura a los roles para todos (para que el frontend sepa qué permisos hay)
alter table public.app_roles enable row level security;

create policy "Todos pueden leer roles"
on public.app_roles for select
using (true);

-- 5. Crear View para facilitar la consulta desde el frontend (Usuario + Permisos)
create or replace view public.users_with_permissions as
select 
  p.id,
  p.email,
  p.role,
  r.permissions
from public.profiles p
left join public.app_roles r on p.role = r.role_name;
