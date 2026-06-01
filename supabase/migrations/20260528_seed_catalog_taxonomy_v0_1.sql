-- SKY MUSIC BG - Seed Catalog Taxonomy v0.1
-- Source: src/data/products.ts catalogCategories + current brand list
-- Scope: categories, subcategories and initial brands only.
-- Products are intentionally NOT inserted in this migration.

begin;

with seed_categories(name, slug, description, sort_order) as (
  values
    ('Клавишни', 'keyboards', 'Клавишни инструменти, пиана, клавири и аксесоари', 10),
    ('Струнни', 'strings', 'Китари, цигулки, усилватели, ефекти и аксесоари', 20),
    ('Озвучаване', 'sound', 'Озвучителни системи, тонколони, пултове и усилватели', 30),
    ('Ударни', 'drums', 'Барабани, перкусии, палки и аксесоари', 40),
    ('Духови', 'wind', 'Кларинети, саксофони, тромпети, флейти и аксесоари', 50),
    ('Микрофони', 'microphones', 'Кабелни, безжични и студийни микрофони', 60),
    ('Студио', 'studio', 'Аудио интерфейси, слушалки, монитори и студийни микрофони', 70),
    ('Аксесоари', 'accessories', 'Кабели, стойки, калъфи, куфари и други аксесоари', 80)
)
insert into public.categories (
  name,
  slug,
  description,
  sort_order,
  is_active
)
select
  name,
  slug,
  description,
  sort_order,
  true
from seed_categories
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

with seed_subcategories(category_slug, name, slug, sort_order) as (
  values
    ('keyboards', 'Дигитални пиана', 'digital-pianos', 10),
    ('keyboards', 'Професионални аранжори', 'professional-arrangers', 20),
    ('keyboards', 'Преносими клавири', 'portable-keyboards', 30),
    ('keyboards', 'Синтезатори', 'synthesizers', 40),
    ('keyboards', 'MIDI клавиатури', 'midi-keyboards', 50),
    ('keyboards', 'Педали', 'pedals', 60),
    ('keyboards', 'Калъфи', 'cases', 70),
    ('keyboards', 'Стойки', 'stands', 80),
    ('keyboards', 'Столчета', 'benches', 90),
    ('keyboards', 'Слушалки', 'headphones', 100),
    ('strings', 'Електрически китари', 'electric-guitars', 10),
    ('strings', 'Акустични китари', 'acoustic-guitars', 20),
    ('strings', 'Класически китари', 'classical-guitars', 30),
    ('strings', 'Китари за деца', 'kids-guitars', 40),
    ('strings', 'Бас китари', 'bass-guitars', 50),
    ('strings', 'Китарни пакети', 'guitar-packs', 60),
    ('strings', 'Цигулки', 'violins', 70),
    ('strings', 'Усилватели за китара', 'guitar-amplifiers', 80),
    ('strings', 'Ефекти и процесори', 'effects-processors', 90),
    ('strings', 'Стойки', 'stands', 100),
    ('sound', 'Тонколони', 'speakers', 10),
    ('sound', 'Озвучителни системи', 'sound-systems', 20),
    ('sound', 'Смесителни пултове', 'mixers', 30),
    ('sound', 'Усилватели', 'amplifiers', 40),
    ('sound', 'Стойки за тонколони', 'speaker-stands', 50),
    ('drums', 'Барабани', 'drums', 10),
    ('drums', 'Рототоми', 'rototoms', 20),
    ('drums', 'Тарамбуки / Перкусии', 'darbukas-percussion', 30),
    ('drums', 'Тъпани', 'folk-drums', 40),
    ('drums', 'Електронни барабани', 'electronic-drums', 50),
    ('drums', 'Стойки за барабани и перкусии', 'drum-percussion-stands', 60),
    ('drums', 'Педали за барабани', 'drum-pedals', 70),
    ('drums', 'Столчета за барабани', 'drum-thrones', 80),
    ('drums', 'Палки за барабани', 'drum-sticks', 90),
    ('wind', 'Кларинети', 'clarinets', 10),
    ('wind', 'Саксофони', 'saxophones', 20),
    ('wind', 'Тромпети', 'trumpets', 30),
    ('wind', 'Флейти', 'flutes', 40),
    ('wind', 'Смазки и препарати', 'lubricants-cleaners', 50),
    ('wind', 'Мундщуци', 'mouthpieces', 60),
    ('microphones', 'Кабелни микрофони', 'wired-microphones', 10),
    ('microphones', 'Безжични микрофони', 'wireless-microphones', 20),
    ('microphones', 'Микрофони за духови инструменти', 'wind-instrument-microphones', 30),
    ('microphones', 'Студийни микрофони', 'studio-microphones', 40),
    ('studio', 'Аудио интерфейси', 'audio-interfaces', 10),
    ('studio', 'Слушалки', 'headphones', 20),
    ('studio', 'Студийни монитори', 'studio-monitors', 30),
    ('studio', 'Студийни микрофони', 'studio-microphones', 40),
    ('accessories', 'Кабели и конектори', 'cables-connectors', 10),
    ('accessories', 'Стойки', 'stands', 20),
    ('accessories', 'Калъфи и куфари', 'cases-bags', 30)
)
insert into public.subcategories (
  category_id,
  name,
  slug,
  sort_order,
  is_active
)
select
  c.id,
  s.name,
  s.slug,
  s.sort_order,
  true
from seed_subcategories s
join public.categories c on c.slug = s.category_slug
on conflict (category_id, slug) do update
set
  name = excluded.name,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

with seed_brands(name, slug, description, sort_order) as (
  values
    ('Yamaha', 'yamaha', 'Музикални инструменти и оборудване', 10)
)
insert into public.brands (
  name,
  slug,
  description,
  sort_order,
  is_active
)
select
  name,
  slug,
  description,
  sort_order,
  true
from seed_brands
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

commit;

select
  'categories' as table_name,
  count(*)::text as total
from public.categories

union all

select
  'subcategories' as table_name,
  count(*)::text as total
from public.subcategories

union all

select
  'brands' as table_name,
  count(*)::text as total
from public.brands

union all

select
  'products' as table_name,
  count(*)::text as total
from public.products;

select
  c.name as category,
  s.name as subcategory,
  s.slug,
  s.sort_order
from public.subcategories s
join public.categories c on c.id = s.category_id
order by c.sort_order, s.sort_order, s.name
limit 80;

select
  name,
  slug,
  is_active
from public.brands
order by sort_order, name;
