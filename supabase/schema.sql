-- LIFT.MN — Supabase өгөгдлийн сангийн бүтэц
--
-- Энэ файлыг Supabase Dashboard -> SQL Editor дотор бүхэлд нь хуулж
-- ажиллуулна. Дахин ажиллуулахад аюулгүй (бүгд IF NOT EXISTS / OR REPLACE).
--
-- ЭРХИЙН ЗАРЧИМ
--   - Хүснэгт бүрт Row Level Security асаалттай. Бодлого зөвшөөрөөгүй
--     бол ямар ч мөр уншигдахгүй, бичигдэхгүй.
--   - Зөвхөн profiles.role = 'admin' хэрэглэгч админы өгөгдөлд хүрнэ.
--   - Шинээр бүртгүүлсэн хэрэглэгч автоматаар 'viewer' болно — ямар ч
--     эрхгүй. Хэн нэгэн санамсаргүй бүртгүүлсэн ч өгөгдөл харахгүй.

-- Өмнөх хувилбарын кирилл нэртэй бодлогуудыг цэвэрлэнэ.
-- Тэр хувилбарыг ажиллуулж байгаагүй бол эдгээр мөр юу ч хийхгүй.
drop policy if exists "profiles: өөрийгөө унших" on public.profiles;
drop policy if exists "elevators: админ бүрэн эрх" on public.elevators;
drop policy if exists "service_records: админ бүрэн эрх" on public.service_records;
drop policy if exists "submissions: зочин илгээх" on public.submissions;
drop policy if exists "submissions: админ унших" on public.submissions;
drop policy if exists "submissions: админ засах" on public.submissions;
drop policy if exists "submissions: админ устгах" on public.submissions;
drop policy if exists "products: нийтэд унших" on public.products;
drop policy if exists "products: админ засах" on public.products;

-- ============================================================ profiles

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  name       text not null default '',
  role       text not null default 'viewer' check (role in ('viewer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Хэрэглэгч зөвхөн өөрийн профайлыг уншина
drop policy if exists "profiles: self read" on public.profiles;
create policy "profiles: self read"
  on public.profiles for select
  using (id = auth.uid());

-- Профайлын role-ийг зөвхөн SQL Editor эсвэл service key-ээр л өөрчилнө.
-- Хэрэглэгч өөрөө өөрийгөө админ болгож чадахгүй — UPDATE бодлого алга.

/**
 * Одоогийн хэрэглэгч админ эсэх.
 * SECURITY DEFINER тул profiles дээрх RLS-ийг тойрч уншина — эс бөгөөс
 * бодлого өөрөө өөрийгөө дуудаж давталтад орно.
 */
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

/** Шинэ хэрэглэгч бүртгүүлэхэд эрхгүй профайл автоматаар үүснэ */
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================== elevators

create table if not exists public.elevators (
  id              text primary key,
  code            text not null,
  building        text not null,
  district        text not null,
  address         text not null,
  lat             double precision not null,
  lng             double precision not null,
  brand           text not null,
  model           text not null,
  floors          integer not null default 0,
  capacity_kg     integer not null default 0,
  installed_at    text not null default '',
  contract_type   text not null default 'monthly',
  status          text not null default 'operational'
                  check (status in ('operational', 'maintenance', 'fault', 'offline')),
  last_service_at text not null default '',
  next_service_at text not null default '',
  contact_name    text not null default '',
  contact_phone   text not null default '',
  updated_at      timestamptz not null default now()
);

alter table public.elevators enable row level security;

drop policy if exists "elevators: admin all" on public.elevators;
create policy "elevators: admin all"
  on public.elevators for all
  using (public.is_admin()) with check (public.is_admin());

-- ===================================================== service_records

create table if not exists public.service_records (
  id           uuid primary key default gen_random_uuid(),
  elevator_id  text not null references public.elevators(id) on delete cascade,
  date         date not null,
  engineer     text not null,
  kind         text not null default 'routine'
               check (kind in ('routine', 'repair', 'emergency', 'inspection')),
  issue        text not null default '',
  resolution   text not null default '',
  parts_used   text[] not null default '{}',
  duration_min integer not null default 0,
  outcome      text not null default 'resolved'
               check (outcome in ('resolved', 'awaiting-parts', 'monitoring')),
  created_at   timestamptz not null default now()
);

create index if not exists idx_records_elevator on public.service_records(elevator_id);
create index if not exists idx_records_date on public.service_records(date desc);

alter table public.service_records enable row level security;

drop policy if exists "service_records: admin all" on public.service_records;
create policy "service_records: admin all"
  on public.service_records for all
  using (public.is_admin()) with check (public.is_admin());

/** Засварын бүртгэл нэмэхэд лифтний "сүүлд үйлчилсэн" огноо шинэчлэгдэнэ */
create or replace function public.touch_elevator_last_service()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.elevators
     set last_service_at = new.date::text, updated_at = now()
   where id = new.elevator_id;
  return new;
end;
$$;

drop trigger if exists on_service_record_added on public.service_records;
create trigger on_service_record_added
  after insert on public.service_records
  for each row execute function public.touch_elevator_last_service();

-- ========================================================= submissions

create table if not exists public.submissions (
  id           text primary key,
  kind         text not null
               check (kind in ('service-ticket', 'emergency', 'booking', 'quote', 'sourcing', 'order')),
  created_at   timestamptz not null default now(),
  contact_name text not null default '',
  phone        text not null,
  summary      text not null default '',
  status       text not null default 'new' check (status in ('new', 'in-progress', 'done')),
  details      jsonb not null default '{}'::jsonb
);

create index if not exists idx_submissions_status on public.submissions(status);
create index if not exists idx_submissions_created on public.submissions(created_at desc);

alter table public.submissions enable row level security;

-- Сайтын маягт — нэвтрээгүй зочин ЗӨВХӨН нэмнэ. Уншиж чадахгүй тул
-- бусдын илгээсэн хүсэлт, утасны дугаар гадагш гарахгүй.
drop policy if exists "submissions: guest insert" on public.submissions;
create policy "submissions: guest insert"
  on public.submissions for insert
  to anon, authenticated
  with check (
    char_length(phone) between 4 and 40
    and char_length(coalesce(contact_name, '')) <= 120
    and char_length(coalesce(summary, '')) <= 300
    and status = 'new'
    -- details дотор хавсаргасан зураг (data URL) орно. Гурван зураг тус бүр
    -- 400 КБ хүртэл шахагдсан байдаг тул 2.5 сая тэмдэгт хангалттай. Энэ
    -- хязгааргүй бол нэвтрээгүй хэн ч дурын хэмжээний өгөгдөл бичиж,
    -- өгөгдлийн санг дүүргэж чадна.
    and length(details::text) <= 2500000
  );

drop policy if exists "submissions: admin read" on public.submissions;
create policy "submissions: admin read"
  on public.submissions for select using (public.is_admin());

drop policy if exists "submissions: admin update" on public.submissions;
create policy "submissions: admin update"
  on public.submissions for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "submissions: admin delete" on public.submissions;
create policy "submissions: admin delete"
  on public.submissions for delete using (public.is_admin());

-- ============================================================ products

create table if not exists public.products (
  id             text primary key,
  name           text not null,
  oem_code       text not null default '',
  category       text not null default 'motor',
  category_label text not null default '',
  brand          text not null default '',
  price          bigint not null default 0,
  stock_count    integer not null default 0,
  delivery_days  text not null default '',
  image          text not null default '',
  specs          jsonb not null default '{}'::jsonb,
  description    text not null default '',
  updated_at     timestamptz not null default now()
);

alter table public.products enable row level security;

-- Дэлгүүр нийтэд нээлттэй тул бүтээгдэхүүнийг хэн ч уншина
drop policy if exists "products: public read" on public.products;
create policy "products: public read"
  on public.products for select to anon, authenticated using (true);

drop policy if exists "products: admin all" on public.products;
create policy "products: admin all"
  on public.products for all
  using (public.is_admin()) with check (public.is_admin());
