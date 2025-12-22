
-- 5. Crear tabla de perfiles (profiles)
-- Esta tabla extiende la tabla auth.users de Supabase
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Habilitar RLS en profiles
alter table public.profiles enable row level security;

create policy "Usuarios pueden ver su propio perfil"
on public.profiles for select
using ( auth.uid() = id );

create policy "Usuarios pueden actualizar su propio perfil"
on public.profiles for update
using ( auth.uid() = id );

-- 7. Trigger para crear perfil automáticamente al registrarse
-- Función que maneja el nuevo usuario
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger que se dispara después de insertar en auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
