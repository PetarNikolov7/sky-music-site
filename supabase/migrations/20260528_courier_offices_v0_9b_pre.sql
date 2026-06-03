create table if not exists public.courier_offices (
  id uuid primary key default gen_random_uuid(),
  courier public.courier_provider not null,
  city text not null,
  office_id text not null,
  name text not null,
  address text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint courier_offices_courier_office_id_unique unique (courier, office_id)
);

alter table public.courier_offices enable row level security;

drop policy if exists "Public read active courier offices" on public.courier_offices;
drop policy if exists "Admins manage courier offices" on public.courier_offices;

create policy "Public read active courier offices"
on public.courier_offices
for select
to public
using (
  is_active = true
);

create policy "Admins manage courier offices"
on public.courier_offices
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.active = true
  )
)
with check (
  exists (
    select 1
    from public.admin_profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.active = true
  )
);

create index if not exists courier_offices_lookup_idx
on public.courier_offices(courier, city, is_active, sort_order, name);

drop trigger if exists courier_offices_set_updated_at on public.courier_offices;

create trigger courier_offices_set_updated_at
before update on public.courier_offices
for each row
execute function private.set_updated_at();

insert into public.courier_offices (
  courier,
  city,
  office_id,
  name,
  address,
  is_active,
  sort_order
)
values
  (
    'econt',
    'Бургас',
    'econt-burgas-test-1',
    'Тестов офис Еконт - Бургас 1',
    'Тестов адрес за офис Еконт 1',
    true,
    10
  ),
  (
    'econt',
    'Бургас',
    'econt-burgas-test-2',
    'Тестов офис Еконт - Бургас 2',
    'Тестов адрес за офис Еконт 2',
    true,
    20
  ),
  (
    'speedy',
    'Бургас',
    'speedy-burgas-test-1',
    'Тестов офис Спиди - Бургас 1',
    'Тестов адрес за офис Спиди 1',
    true,
    10
  ),
  (
    'speedy',
    'Бургас',
    'speedy-burgas-test-2',
    'Тестов офис Спиди - Бургас 2',
    'Тестов адрес за офис Спиди 2',
    true,
    20
  )
on conflict (courier, office_id) do update
set
  city = excluded.city,
  name = excluded.name,
  address = excluded.address,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();

select
  courier,
  city,
  count(*)::text as office_count
from public.courier_offices
group by courier, city
order by courier, city;