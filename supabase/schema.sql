create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'hotel_admin', 'super_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hotels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  city text not null,
  country text not null default 'South Africa',
  address text,
  description text,
  contact_email text,
  contact_phone text,
  rating numeric(2,1) not null default 4.5,
  price_from numeric(12,2) not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hotel_images (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  name text not null,
  room_number text,
  description text,
  price_per_night numeric(12,2) not null,
  capacity int not null default 2,
  bed_type text,
  room_size text,
  status text not null default 'available' check (status in ('available', 'fully_booked', 'maintenance')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_images (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  customer_id uuid references public.profiles(id) on delete set null,
  guest_full_name text not null,
  guest_email text not null,
  guest_phone text not null,
  hotel_id uuid not null references public.hotels(id),
  room_id uuid not null references public.rooms(id),
  check_in_date date not null,
  check_out_date date not null,
  guest_count int not null,
  nights int not null,
  subtotal numeric(12,2) not null,
  taxes numeric(12,2) not null,
  total_amount numeric(12,2) not null,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'confirmed', 'checked_in', 'completed', 'cancelled', 'refunded')),
  qr_token_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_booking_dates check (check_out_date > check_in_date)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  gateway text not null default 'pesapal',
  gateway_reference text not null unique,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  status text not null check (status in ('pending', 'successful', 'failed', 'refunded')),
  paid_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete set null,
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  status text not null default 'pending' check (status in ('pending', 'published', 'hidden')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.hotels enable row level security;
alter table public.hotel_images enable row level security;
alter table public.rooms enable row level security;
alter table public.room_images enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;

create policy "Public can read active hotels" on public.hotels
  for select using (status = 'active');

create policy "Public can read hotel images" on public.hotel_images
  for select using (true);

create policy "Public can read rooms" on public.rooms
  for select using (true);

create policy "Public can read room images" on public.room_images
  for select using (true);

create policy "Admins manage hotels" on public.hotels
  for all using (
    exists (
      select 1 from public.profiles
      where auth_user_id = auth.uid()
      and role in ('hotel_admin', 'super_admin')
    )
  );

create policy "Admins manage rooms" on public.rooms
  for all using (
    exists (
      select 1 from public.profiles
      where auth_user_id = auth.uid()
      and role in ('hotel_admin', 'super_admin')
    )
  );

create policy "Admins read bookings" on public.bookings
  for select using (
    exists (
      select 1 from public.profiles
      where auth_user_id = auth.uid()
      and role in ('hotel_admin', 'super_admin')
    )
  );

create index if not exists bookings_lookup_idx on public.bookings (guest_email, booking_reference);
create index if not exists rooms_hotel_id_idx on public.rooms (hotel_id);
create index if not exists payments_booking_id_idx on public.payments (booking_id);
