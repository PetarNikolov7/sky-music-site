-- SKY MUSIC BG / Admin Foundation v0.1
-- Purpose: secure database foundation for products, orders and future homepage banner management.
-- Run ONCE in the already verified empty Supabase project.
-- Verified starting state expected:
--   public_tables = NONE
--   storage_buckets = NONE
--   auth_users_count = 0
--
-- Important:
-- - This migration does NOT change the public Next.js site yet.
-- - This migration does NOT create Storage buckets yet. Product/banner image buckets
--   will be created through the Supabase Storage UI when the upload feature is built.
-- - No admin user is created by this migration. That is the next controlled step.

begin;

-- ---------------------------------------------------------------------------
-- 0. Internal helper schema
-- ---------------------------------------------------------------------------

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
grant usage on schema private to authenticated;

-- ---------------------------------------------------------------------------
-- 1. Enumerated business values
-- ---------------------------------------------------------------------------

create type public.product_stock_status as enum (
  'available',
  'on_request',
  'out_of_stock'
);

create type public.order_status as enum (
  'new',
  'contacted',
  'confirmed',
  'preparing',
  'shipped',
  'completed',
  'cancelled'
);

create type public.fulfillment_method as enum (
  'pickup_store',
  'courier_office',
  'courier_locker',
  'courier_address',
  'to_confirm'
);

create type public.courier_provider as enum (
  'econt',
  'speedy'
);

create type public.payment_method as enum (
  'cash_on_delivery',
  'pay_in_store',
  'to_confirm'
);

-- ---------------------------------------------------------------------------
-- 2. Administrator authorisation table
--    Authentication remains in Supabase Auth; this table marks which users
--    are allowed to administer SKY MUSIC BG.
-- ---------------------------------------------------------------------------

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.admin_profiles is
  'Authenticated users authorised to access the SKY MUSIC BG admin panel.';

-- ---------------------------------------------------------------------------
-- 3. Catalogue taxonomy
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) >= 2),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index categories_name_unique_ci
  on public.categories (lower(name));

create unique index categories_slug_unique
  on public.categories (slug);

create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null check (length(btrim(name)) >= 2),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subcategories_category_slug_unique unique (category_id, slug),
  constraint subcategories_category_name_unique unique (category_id, name),
  constraint subcategories_id_category_unique unique (id, category_id)
);

create index subcategories_category_sort_idx
  on public.subcategories (category_id, sort_order, name);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) >= 2),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  website_url text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index brands_name_unique_ci
  on public.brands (lower(name));

create unique index brands_slug_unique
  on public.brands (slug);

-- ---------------------------------------------------------------------------
-- 4. Products and product images
-- ---------------------------------------------------------------------------

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sku text,
  name text not null check (length(btrim(name)) >= 2),
  brand_id uuid references public.brands(id) on delete restrict,
  category_id uuid not null references public.categories(id) on delete restrict,
  subcategory_id uuid not null,
  short_description text not null default '',
  description text not null default '',
  price_amount numeric(12,2) not null check (price_amount >= 0),
  currency char(3) not null default 'EUR'
    check (currency ~ '^[A-Z]{3}$'),
  stock_status public.product_stock_status not null default 'available',
  badges text[] not null default '{}'::text[],
  specifications jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  featured_sort_order integer check (featured_sort_order is null or featured_sort_order >= 0),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_unique unique (slug),
  constraint products_subcategory_belongs_to_category
    foreign key (subcategory_id, category_id)
    references public.subcategories(id, category_id)
    on delete restrict
);

create unique index products_sku_unique_not_null
  on public.products (sku)
  where sku is not null;

create index products_public_listing_idx
  on public.products (is_published, category_id, subcategory_id, brand_id, created_at desc);

create index products_featured_idx
  on public.products (is_published, is_featured, featured_sort_order)
  where is_featured = true;

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_bucket text not null default 'product-images',
  storage_path text not null check (length(btrim(storage_path)) > 0),
  alt_text text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  constraint product_images_storage_path_unique unique (storage_bucket, storage_path)
);

create index product_images_product_sort_idx
  on public.product_images (product_id, sort_order, created_at);

create unique index product_images_one_primary_per_product
  on public.product_images (product_id)
  where is_primary = true;

-- ---------------------------------------------------------------------------
-- 5. Homepage promotional banners
-- ---------------------------------------------------------------------------

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  storage_bucket text not null default 'banner-images',
  storage_path text not null check (length(btrim(storage_path)) > 0),
  alt_text text not null default '',
  target_href text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint banners_storage_path_unique unique (storage_bucket, storage_path),
  constraint banners_active_window_valid
    check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create index banners_public_listing_idx
  on public.banners (is_active, sort_order, created_at desc);

-- ---------------------------------------------------------------------------
-- 6. Orders and order lines
--    Ready for future Econt/Speedy office/locker integration.
-- ---------------------------------------------------------------------------

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity (start with 1001) unique,
  status public.order_status not null default 'new',
  source text not null default 'website'
    check (source in ('website', 'admin_manual')),
  customer_name text not null check (length(btrim(customer_name)) >= 2),
  customer_phone text not null check (length(btrim(customer_phone)) >= 5),
  customer_email text,
  fulfillment_method public.fulfillment_method not null default 'to_confirm',
  courier public.courier_provider,
  delivery_city text,
  delivery_address text,
  courier_office_id text,
  courier_office_name text,
  courier_office_address text,
  payment_method public.payment_method not null default 'to_confirm',
  delivery_price_amount numeric(12,2)
    check (delivery_price_amount is null or delivery_price_amount >= 0),
  currency char(3) not null default 'EUR'
    check (currency ~ '^[A-Z]{3}$'),
  customer_note text,
  admin_note text,
  terms_version text,
  privacy_version text,
  submitted_at timestamptz not null default now(),
  confirmed_at timestamptz,
  shipped_at timestamptz,
  completed_at timestamptz,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index orders_status_submitted_idx
  on public.orders (status, submitted_at desc);

create index orders_customer_phone_idx
  on public.orders (customer_phone);

create index orders_customer_email_idx
  on public.orders (customer_email)
  where customer_email is not null;

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null check (length(btrim(product_name)) >= 2),
  product_sku text,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_amount numeric(12,2)
    check (unit_price_amount is null or unit_price_amount >= 0),
  currency char(3) not null default 'EUR'
    check (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default now()
);

create index order_items_order_idx
  on public.order_items (order_id);

create table public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  previous_status public.order_status,
  new_status public.order_status not null,
  changed_by uuid references auth.users(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index order_status_events_order_created_idx
  on public.order_status_events (order_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 7. Update timestamp triggers and order audit trigger
-- ---------------------------------------------------------------------------

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;

create trigger admin_profiles_set_updated_at
before update on public.admin_profiles
for each row execute function private.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row execute function private.set_updated_at();

create trigger subcategories_set_updated_at
before update on public.subcategories
for each row execute function private.set_updated_at();

create trigger brands_set_updated_at
before update on public.brands
for each row execute function private.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function private.set_updated_at();

create trigger banners_set_updated_at
before update on public.banners
for each row execute function private.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function private.set_updated_at();

create or replace function private.log_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.order_status_events (
      order_id,
      previous_status,
      new_status,
      changed_by
    ) values (
      new.id,
      null,
      new.status,
      (select auth.uid())
    );
  elsif old.status is distinct from new.status then
    insert into public.order_status_events (
      order_id,
      previous_status,
      new_status,
      changed_by
    ) values (
      new.id,
      old.status,
      new.status,
      (select auth.uid())
    );
  end if;

  return new;
end;
$$;

revoke all on function private.log_order_status_change() from public, anon, authenticated;

create trigger orders_log_status_change
after insert or update of status on public.orders
for each row execute function private.log_order_status_change();

-- ---------------------------------------------------------------------------
-- 8. Admin check helper used by RLS
-- ---------------------------------------------------------------------------

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = (select auth.uid())
      and active = true
  );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.admin_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.banners enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_events enable row level security;

revoke all on table
  public.admin_profiles,
  public.categories,
  public.subcategories,
  public.brands,
  public.products,
  public.product_images,
  public.banners,
  public.orders,
  public.order_items,
  public.order_status_events
from anon, authenticated;

grant select on table
  public.categories,
  public.subcategories,
  public.brands,
  public.products,
  public.product_images,
  public.banners
to anon, authenticated;

grant select, insert, update, delete on table
  public.admin_profiles,
  public.categories,
  public.subcategories,
  public.brands,
  public.products,
  public.product_images,
  public.banners,
  public.orders,
  public.order_items
to authenticated;

grant select on table public.order_status_events to authenticated;
grant usage, select on sequence public.orders_order_number_seq to authenticated;

create policy admin_profiles_read_own
  on public.admin_profiles
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy admin_profiles_admin_manage
  on public.admin_profiles
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy categories_public_read_active
  on public.categories
  for select
  to anon, authenticated
  using (is_active = true);

create policy categories_admin_manage
  on public.categories
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy subcategories_public_read_active
  on public.subcategories
  for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1
      from public.categories c
      where c.id = category_id
        and c.is_active = true
    )
  );

create policy subcategories_admin_manage
  on public.subcategories
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy brands_public_read_active
  on public.brands
  for select
  to anon, authenticated
  using (is_active = true);

create policy brands_admin_manage
  on public.brands
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy products_public_read_published
  on public.products
  for select
  to anon, authenticated
  using (
    is_published = true
    and exists (
      select 1
      from public.categories c
      where c.id = category_id
        and c.is_active = true
    )
    and exists (
      select 1
      from public.subcategories s
      where s.id = subcategory_id
        and s.category_id = category_id
        and s.is_active = true
    )
    and (
      brand_id is null
      or exists (
        select 1
        from public.brands b
        where b.id = brand_id
          and b.is_active = true
      )
    )
  );

create policy products_admin_manage
  on public.products
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy product_images_public_read_published_product
  on public.product_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_id
        and p.is_published = true
    )
  );

create policy product_images_admin_manage
  on public.product_images
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy banners_public_read_active
  on public.banners
  for select
  to anon, authenticated
  using (
    is_active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now())
  );

create policy banners_admin_manage
  on public.banners
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy orders_admin_manage
  on public.orders
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy order_items_admin_manage
  on public.order_items
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy order_status_events_admin_read
  on public.order_status_events
  for select
  to authenticated
  using ((select private.is_admin()));

comment on table public.categories is 'Product catalogue main categories.';
comment on table public.subcategories is 'Product catalogue subcategories grouped under categories.';
comment on table public.brands is 'Product manufacturers/brands.';
comment on table public.products is 'Products managed through the SKY MUSIC BG admin panel.';
comment on table public.product_images is 'Metadata for product images stored in Supabase Storage.';
comment on table public.banners is 'Homepage banner slides managed through the admin panel.';
comment on table public.orders is 'Customer order requests and confirmed order workflow.';
comment on table public.order_items is 'Product snapshots belonging to an order.';
comment on table public.order_status_events is 'Read-only audit history of order status changes.';

commit;

-- End of Admin Foundation v0.1 migration.
