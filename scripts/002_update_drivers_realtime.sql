-- Add updated_at column to drivers if not exists
alter table public.drivers add column if not exists updated_at timestamp with time zone default now();

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create trigger for auto-updating updated_at
drop trigger if exists update_drivers_updated_at on public.drivers;
create trigger update_drivers_updated_at
  before update on public.drivers
  for each row
  execute function public.update_updated_at_column();

-- Enable realtime for drivers table
alter publication supabase_realtime add table public.drivers;
