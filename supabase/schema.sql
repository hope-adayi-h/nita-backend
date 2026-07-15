-- =========================================================
-- Cahier des charges : Empire Nita Beauty & Nita Cosmétics
-- Schéma de base de données PostgreSQL (Supabase)
-- =========================================================

create extension if not exists "uuid-ossp";

-- =========================================================
-- 1. RÔLES ADMIN
-- =========================================================
-- On étend la table auth.users de Supabase avec un rôle
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

-- =========================================================
-- 2. SERVICES (salon Empire Nita Beauty)
-- =========================================================
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  category text not null check (category in ('tresses', 'wig_weaving', 'makeup_ongles')),
  name text not null,
  description text,
  price numeric(10,2) not null,
  duration_minutes int not null default 60,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 3. CRÉNEAUX DISPONIBLES (agenda du salon)
-- =========================================================
create table if not exists public.availability_slots (
  id uuid primary key default uuid_generate_v4(),
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  is_open boolean not null default true,
  created_at timestamptz not null default now(),
  unique (slot_date, start_time)
);

-- =========================================================
-- 4. RENDEZ-VOUS (bookings)
-- =========================================================
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  client_phone text not null,
  service_id uuid references public.services(id) on delete set null,
  scheduled_at timestamptz not null,
  status text not null default 'en_attente'
    check (status in ('en_attente', 'confirme', 'termine', 'annule')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_scheduled_at on public.bookings(scheduled_at);

-- =========================================================
-- 5. PRODUITS (Nita Cosmétics)
-- =========================================================
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  ingredients text,
  category text not null check (category in ('savon', 'huile', 'gel', 'creme', 'autre')),
  price numeric(10,2) not null,
  promo_price numeric(10,2),
  stock int not null default 0,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 6. COMMANDES (orders + order_items)
-- =========================================================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  client_phone text not null,
  delivery_address text not null,
  payment_method text not null check (payment_method in ('mobile_money', 'a_la_livraison')),
  payment_status text not null default 'en_attente'
    check (payment_status in ('en_attente', 'paye', 'echoue', 'rembourse')),
  order_status text not null default 'en_attente'
    check (order_status in ('en_attente', 'en_livraison', 'livree', 'annulee')),
  total_amount numeric(10,2) not null default 0,
  payment_reference text, -- référence transaction SebPay/CinetPay
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

create index if not exists idx_orders_status on public.orders(order_status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- =========================================================
-- 7. FORMATIONS (trainings + training_registrations)
-- =========================================================
create table if not exists public.trainings (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  modules text[] not null default '{}',
  start_date date not null,
  end_date date not null,
  registration_fee numeric(10,2) not null,
  training_fee numeric(10,2) not null,
  seats_available int,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.training_registrations (
  id uuid primary key default uuid_generate_v4(),
  training_id uuid not null references public.trainings(id) on delete cascade,
  client_name text not null,
  client_phone text not null,
  payment_status text not null default 'en_attente'
    check (payment_status in ('en_attente', 'acompte_paye', 'paye_integralement', 'echoue')),
  payment_reference text,
  created_at timestamptz not null default now()
);

create index if not exists idx_training_registrations_training_id
  on public.training_registrations(training_id);

-- =========================================================
-- 8. TRIGGER : recalcul automatique du total_amount d'une commande
-- =========================================================
create or replace function public.recalculate_order_total()
returns trigger as $$
begin
  update public.orders
  set total_amount = (
    select coalesce(sum(quantity * unit_price), 0)
    from public.order_items
    where order_id = coalesce(new.order_id, old.order_id)
  )
  where id = coalesce(new.order_id, old.order_id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_recalculate_order_total on public.order_items;
create trigger trg_recalculate_order_total
after insert or update or delete on public.order_items
for each row execute function public.recalculate_order_total();

-- =========================================================
-- 9. ROW LEVEL SECURITY
-- =========================================================
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.availability_slots enable row level security;
alter table public.bookings enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.trainings enable row level security;
alter table public.training_registrations enable row level security;

-- Fonction utilitaire : l'utilisateur courant est-il admin ?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$ language sql security definer stable;

-- --- profiles : chacun voit son propre profil, l'admin voit tout ---
create policy "profiles_self_select" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_self_update" on public.profiles
  for update using (id = auth.uid());

-- --- services : lecture publique (catalogue), écriture admin only ---
create policy "services_public_read" on public.services
  for select using (active = true or public.is_admin());
create policy "services_admin_write" on public.services
  for insert with check (public.is_admin());
create policy "services_admin_update" on public.services
  for update using (public.is_admin());
create policy "services_admin_delete" on public.services
  for delete using (public.is_admin());

-- --- availability_slots : lecture publique, écriture admin ---
create policy "slots_public_read" on public.availability_slots
  for select using (true);
create policy "slots_admin_write" on public.availability_slots
  for insert with check (public.is_admin());
create policy "slots_admin_update" on public.availability_slots
  for update using (public.is_admin());
create policy "slots_admin_delete" on public.availability_slots
  for delete using (public.is_admin());

-- --- bookings : création publique (formulaire RDV), lecture/écriture admin ---
create policy "bookings_public_insert" on public.bookings
  for insert with check (true);
create policy "bookings_admin_select" on public.bookings
  for select using (public.is_admin());
create policy "bookings_admin_update" on public.bookings
  for update using (public.is_admin());

-- --- products : lecture publique, écriture admin ---
create policy "products_public_read" on public.products
  for select using (active = true or public.is_admin());
create policy "products_admin_write" on public.products
  for insert with check (public.is_admin());
create policy "products_admin_update" on public.products
  for update using (public.is_admin());
create policy "products_admin_delete" on public.products
  for delete using (public.is_admin());

-- --- orders / order_items : création publique (checkout), lecture/écriture admin ---
create policy "orders_public_insert" on public.orders
  for insert with check (true);
create policy "orders_admin_select" on public.orders
  for select using (public.is_admin());
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin());

create policy "order_items_public_insert" on public.order_items
  for insert with check (true);
create policy "order_items_admin_select" on public.order_items
  for select using (public.is_admin());

-- --- trainings : lecture publique, écriture admin ---
create policy "trainings_public_read" on public.trainings
  for select using (active = true or public.is_admin());
create policy "trainings_admin_write" on public.trainings
  for insert with check (public.is_admin());
create policy "trainings_admin_update" on public.trainings
  for update using (public.is_admin());

-- --- training_registrations : création publique, lecture/écriture admin ---
create policy "training_registrations_public_insert" on public.training_registrations
  for insert with check (true);
create policy "training_registrations_admin_select" on public.training_registrations
  for select using (public.is_admin());
create policy "training_registrations_admin_update" on public.training_registrations
  for update using (public.is_admin());

-- =========================================================
-- 10. DONNÉES DE DÉPART (seed) — à adapter/compléter
-- =========================================================
insert into public.services (category, name, price, duration_minutes) values
  ('tresses', 'Tresses box', 5000, 180),
  ('tresses', 'Cornrows', 3000, 90),
  ('tresses', 'Tresses fulani', 4000, 120),
  ('tresses', 'Twists sénégalais', 6000, 180),
  ('tresses', 'Dreadlocks', 7000, 240),
  ('wig_weaving', 'Wig styling', 3500, 90),
  ('wig_weaving', 'Ghana weaving', 4000, 120),
  ('makeup_ongles', 'Maquillage', 5000, 60),
  ('makeup_ongles', 'Pédicure', 2500, 45),
  ('makeup_ongles', 'Manucure', 2000, 30),
  ('makeup_ongles', 'Pose ongle', 3000, 60)
on conflict do nothing;

insert into public.products (name, category, price, promo_price, stock, description) values
  ('Savon Or - Tout type de teint', 'savon', 5000, 3000, 50, 'Huile de coco, miel, carotte, vitamine E'),
  ('Savon Or - Éclaircissant', 'savon', 5000, 3000, 50, 'Huile de coco, miel, lait, collagène, glutha, vitamine E'),
  ('Savon Homme - Tout type de teint', 'savon', 5000, 2500, 50, 'Formule spécifique peau homme'),
  ('Huile Quinto', 'huile', 4000, null, 30, null),
  ('Gel douche', 'gel', 3500, null, 30, null),
  ('Crème visage', 'creme', 4500, null, 30, null)
on conflict do nothing;

insert into public.trainings (title, modules, start_date, end_date, registration_fee, training_fee) values
  ('Spécial Formation Cosmétiques',
   array['Savon noir nigérian', 'Huile quinto', 'Savon éclaircissant', 'Savon de base', 'Gel douche', 'Crème visage'],
   '2026-07-27', '2026-08-01', 5000, 20000)
on conflict do nothing;
