-- Create drivers table
create table if not exists public.drivers (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  status text not null default 'inactive' check (status in ('active', 'inactive')),
  current_lat double precision,
  current_lng double precision,
  created_at timestamp with time zone default now()
);

-- Create emergency_requests table
create table if not exists public.emergency_requests (
  id uuid primary key default gen_random_uuid(),
  victim_lat double precision not null,
  victim_lng double precision not null,
  emergency_type text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'completed', 'cancelled')),
  assigned_driver_id uuid references public.drivers(id),
  eta_minutes integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.drivers enable row level security;
alter table public.emergency_requests enable row level security;

-- Drivers policies
create policy "drivers_select_own" on public.drivers for select using (auth.uid() = id);
create policy "drivers_update_own" on public.drivers for update using (auth.uid() = id);
create policy "drivers_insert_own" on public.drivers for insert with check (auth.uid() = id);

-- Emergency requests policies - drivers can see pending or their assigned requests
create policy "emergency_select" on public.emergency_requests for select using (
  status = 'pending' or assigned_driver_id = auth.uid()
);
create policy "emergency_update" on public.emergency_requests for update using (
  status = 'pending' or assigned_driver_id = auth.uid()
);

-- Allow API to insert emergency requests (service role will bypass RLS)
create policy "emergency_insert_anon" on public.emergency_requests for insert with check (true);

-- Create trigger for auto-creating driver profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.drivers (id, name, email, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'Driver'),
    new.email,
    'inactive'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Enable realtime for emergency_requests
alter publication supabase_realtime add table public.emergency_requests;
