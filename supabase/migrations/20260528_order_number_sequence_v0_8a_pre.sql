do $$
declare
  next_order_number bigint;
begin
  select greatest(
    coalesce(max(order_number), 1000) + 1,
    1001
  )
  into next_order_number
  from public.orders;

  execute format(
    'alter table public.orders alter column order_number restart with %s',
    next_order_number
  );
end $$;

create unique index if not exists orders_order_number_unique_idx
on public.orders(order_number);

select
  column_name,
  data_type,
  is_nullable,
  column_default,
  is_identity,
  identity_generation,
  identity_start,
  identity_increment
from information_schema.columns
where table_schema = 'public'
  and table_name = 'orders'
  and column_name = 'order_number';

select
  pg_get_serial_sequence('public.orders', 'order_number') as linked_sequence;