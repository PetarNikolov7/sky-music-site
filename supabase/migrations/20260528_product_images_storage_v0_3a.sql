insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read product images" on storage.objects;
drop policy if exists "Admins read product images" on storage.objects;
drop policy if exists "Admins upload product images" on storage.objects;
drop policy if exists "Admins update product images" on storage.objects;
drop policy if exists "Admins delete product images" on storage.objects;

create policy "Public read product images"
on storage.objects
for select
to public
using (
  bucket_id = 'product-images'
);

create policy "Admins upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and exists (
    select 1
    from public.admin_profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.active = true
  )
);

create policy "Admins update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and exists (
    select 1
    from public.admin_profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.active = true
  )
)
with check (
  bucket_id = 'product-images'
  and exists (
    select 1
    from public.admin_profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.active = true
  )
);

create policy "Admins delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and exists (
    select 1
    from public.admin_profiles admin_profile
    where admin_profile.user_id = auth.uid()
      and admin_profile.active = true
  )
);