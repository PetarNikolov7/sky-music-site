create table if not exists public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_specs enable row level security;

drop policy if exists "Public read published product specs" on public.product_specs;
drop policy if exists "Admins read product specs" on public.product_specs;
drop policy if exists "Admins insert product specs" on public.product_specs;
drop policy if exists "Admins update product specs" on public.product_specs;
drop policy if exists "Admins delete product specs" on public.product_specs;

create policy "Public read published product specs"
on public.product_specs
for select
to public
using (
  exists (
    select 1
    from public.products p
    where p.id = product_specs.product_id
      and p.is_published = true
  )
);

create policy "Admins read product specs"
on public.product_specs
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.active = true
  )
);

create policy "Admins insert product specs"
on public.product_specs
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.active = true
  )
);

create policy "Admins update product specs"
on public.product_specs
for update
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

create policy "Admins delete product specs"
on public.product_specs
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.active = true
  )
);

create index if not exists product_specs_product_id_sort_order_idx
on public.product_specs(product_id, sort_order);

delete from public.product_specs
where product_id = (
  select id
  from public.products
  where slug = 'yamaha-c40'
);

insert into public.product_specs (
  product_id,
  label,
  value,
  sort_order
)
select
  p.id,
  spec.label,
  spec.value,
  spec.sort_order
from public.products p
cross join (
  values
    ('Размер', '4/4 стандартен – 39"', 10),
    ('Челна дъска', 'Смърч', 20),
    ('Задна дъска и страници', 'Meranti', 30),
    ('Гриф', 'Палисандър', 40),
    ('Бридж', 'Палисандър', 50),
    ('Ширина на нулево прагче', '52 mm', 60),
    ('Дълбочина на тялото', '43–100 mm', 70),
    ('Скала', '650 mm / 25.59"', 80),
    ('Цвят', 'Натурален', 90),
    ('Струни', 'Найлонови', 100),
    ('Финиш', 'Гланц', 110),
    ('Брой струни', '6', 120)
) as spec(label, value, sort_order)
where p.slug = 'yamaha-c40';

select
  'product_specs_count' as check_name,
  count(*)::text as result
from public.product_specs
where product_id = (
  select id
  from public.products
  where slug = 'yamaha-c40'
);