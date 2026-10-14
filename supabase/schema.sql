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
  -- Доторх загварууд. Жишээ нь "Лифтний товч" бүтээгдэхүүн дотор брэнд
  -- тус бүрийн загвар (BR27C/A311, KDS50/300 ...) хувилбар болж багтана.
  -- Бүтэц: [{id, code, name, brand, price, stockCount, image, note}]
  variants       jsonb not null default '[]'::jsonb,
  updated_at     timestamptz not null default now()
);

-- Хүснэгт өмнө нь үүссэн бол баганыг нэмнэ (дахин ажиллуулахад аюулгүй)
alter table public.products add column if not exists variants jsonb not null default '[]'::jsonb;

alter table public.products enable row level security;

-- Дэлгүүр нийтэд нээлттэй тул бүтээгдэхүүнийг хэн ч уншина
drop policy if exists "products: public read" on public.products;
create policy "products: public read"
  on public.products for select to anon, authenticated using (true);

drop policy if exists "products: admin all" on public.products;
create policy "products: admin all"
  on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- ========================================================= storage: naadam
-- Багийн мэдүүлэг (Word/PDF). Тайлбарыг supabase/naadam-storage.sql-ээс үзнэ үү.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'naadam', 'naadam', false, 20971520,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "naadam: guest upload" on storage.objects;
create policy "naadam: guest upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'naadam');

drop policy if exists "naadam: admin read" on storage.objects;
create policy "naadam: admin read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'naadam' and public.is_admin());

drop policy if exists "naadam: admin delete" on storage.objects;
create policy "naadam: admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'naadam' and public.is_admin());

-- ============================================================ storage: бүтээгдэхүүний зураг
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "products: admin upload" on storage.objects;
create policy "products: admin upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'products' and public.is_admin());

drop policy if exists "products: admin update" on storage.objects;
create policy "products: admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'products' and public.is_admin());

drop policy if exists "products: admin delete" on storage.objects;
create policy "products: admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'products' and public.is_admin());

-- Устгахын өмнө файлын жагсаалтыг уншихад (remove) хэрэгтэй
drop policy if exists "products: admin read" on storage.objects;
create policy "products: admin read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'products' and public.is_admin());

-- ============================================================ админы хэрэглэгчид, эрх
-- ------------------------------------------------------------ permissions

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'permissions'
  ) then
    alter table public.profiles add column permissions text[] not null default '{}';
    -- Одоо байгаа админууд бүх эрхээ хадгална
    update public.profiles
       set permissions = array['requests', 'quotes', 'naadam', 'elevators', 'products', 'users']
     where role = 'admin';
  end if;
end $$;

alter table public.profiles drop constraint if exists profiles_permissions_check;
alter table public.profiles add constraint profiles_permissions_check
  check (permissions <@ array['requests', 'quotes', 'naadam', 'elevators', 'products', 'users']::text[]);

/** Одоогийн хэрэглэгч тухайн эрхтэй эсэх */
create or replace function public.has_perm(p text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and p = any(permissions)
  );
$$;

/** Админы хэсэгт ямар нэг эрхтэй эсэх */
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and cardinality(permissions) > 0
  );
$$;

/** Хүсэлтийн төрлөөс хамаарч шаардах эрх */
create or replace function public.can_access_submission(p_kind text, p_details jsonb)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when p_kind = 'quote' and p_details ->> 'Төрөл' = 'Сэлбэгийн үнийн санал' then public.has_perm('quotes')
    when p_kind = 'booking' and p_details ->> 'Төрөл' = 'Спортын наадам 2026' then public.has_perm('naadam')
    else public.has_perm('requests')
  end;
$$;

-- ------------------------------------------------------------ RLS бодлого

drop policy if exists "profiles: self read" on public.profiles;
create policy "profiles: self read"
  on public.profiles for select
  using (id = auth.uid() or public.has_perm('users'));

drop policy if exists "elevators: admin all" on public.elevators;
create policy "elevators: admin all"
  on public.elevators for all
  using (public.has_perm('elevators')) with check (public.has_perm('elevators'));

drop policy if exists "service_records: admin all" on public.service_records;
create policy "service_records: admin all"
  on public.service_records for all
  using (public.has_perm('elevators')) with check (public.has_perm('elevators'));

drop policy if exists "submissions: admin read" on public.submissions;
create policy "submissions: admin read"
  on public.submissions for select
  using (public.can_access_submission(kind, details));

drop policy if exists "submissions: admin update" on public.submissions;
create policy "submissions: admin update"
  on public.submissions for update
  using (public.can_access_submission(kind, details))
  with check (public.can_access_submission(kind, details));

drop policy if exists "submissions: admin delete" on public.submissions;
create policy "submissions: admin delete"
  on public.submissions for delete
  using (public.can_access_submission(kind, details));

drop policy if exists "products: admin all" on public.products;
create policy "products: admin all"
  on public.products for all
  to authenticated
  using (public.has_perm('products')) with check (public.has_perm('products'));

-- Storage: наадмын мэдүүлэг, бүтээгдэхүүний зураг
drop policy if exists "naadam: admin read" on storage.objects;
create policy "naadam: admin read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'naadam' and public.has_perm('naadam'));

drop policy if exists "naadam: admin delete" on storage.objects;
create policy "naadam: admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'naadam' and public.has_perm('naadam'));

drop policy if exists "products: admin upload" on storage.objects;
create policy "products: admin upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'products' and public.has_perm('products'));

drop policy if exists "products: admin update" on storage.objects;
create policy "products: admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'products' and public.has_perm('products'));

drop policy if exists "products: admin delete" on storage.objects;
create policy "products: admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'products' and public.has_perm('products'));

drop policy if exists "products: admin read" on storage.objects;
create policy "products: admin read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'products' and public.has_perm('products'));

-- ------------------------------------------------------ хэрэглэгч удирдах

create or replace function public.require_users_perm()
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.has_perm('users') then
    raise exception 'Хэрэглэгч удирдах эрх алга' using errcode = '42501';
  end if;
end;
$$;

create or replace function public.check_new_password(p_password text)
returns void
language plpgsql
immutable
as $$
begin
  if p_password is null or char_length(p_password) < 8 then
    raise exception 'Нууц үг хамгийн багадаа 8 тэмдэгт байна' using errcode = '22023';
  end if;
  if octet_length(p_password) > 72 then
    raise exception 'Нууц үг хэт урт байна (72 байтаас бага)' using errcode = '22023';
  end if;
end;
$$;

/** Бүх хэрэглэгч — эрхтэй, эрхгүй (Supabase-д шууд үүсгэсэн) бүгд */
create or replace function public.admin_list_users()
returns table (
  id uuid, email text, name text, role text, permissions text[],
  created_at timestamptz, last_sign_in_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform public.require_users_perm();
  return query
    select u.id, u.email::text, coalesce(p.name, ''), coalesce(p.role, 'viewer'),
           coalesce(p.permissions, '{}'::text[]), u.created_at, u.last_sign_in_at
      from auth.users u
      left join public.profiles p on p.id = u.id
     order by u.created_at;
end;
$$;

/** Шинэ хэрэглэгч — имэйл баталгаажсан, шууд нэвтэрч болно */
create or replace function public.admin_create_user(
  p_email text, p_password text, p_name text, p_permissions text[]
)
returns uuid
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_id    uuid := gen_random_uuid();
  v_email text := lower(trim(p_email));
  v_now   timestamptz := now();
begin
  perform public.require_users_perm();
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Имэйл хаяг буруу байна' using errcode = '22023';
  end if;
  perform public.check_new_password(p_password);
  if exists (select 1 from auth.users where lower(email) = v_email) then
    raise exception 'Энэ имэйлтэй хэрэглэгч аль хэдийн бүртгэлтэй. Жагсаалтаас эрхийг нь тохируулна уу.'
      using errcode = '23505';
  end if;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', v_email,
    extensions.crypt(p_password, extensions.gen_salt('bf', 10)), v_now,
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object('name', coalesce(trim(p_name), '')),
    v_now, v_now, '', '', '', ''
  );

  insert into auth.identities (
    id, provider_id, user_id, identity_data, provider, created_at, updated_at
  ) values (
    gen_random_uuid(), v_id::text, v_id,
    jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true, 'phone_verified', false),
    'email', v_now, v_now
  );

  insert into public.profiles (id, email, name, role, permissions)
  values (
    v_id, v_email, coalesce(trim(p_name), ''),
    case when cardinality(coalesce(p_permissions, '{}')) > 0 then 'admin' else 'viewer' end,
    coalesce(p_permissions, '{}')
  )
  on conflict (id) do update
    set name = excluded.name, role = excluded.role, permissions = excluded.permissions;

  return v_id;
end;
$$;

/** Нэр, эрх солих. Эрхгүй болговол админ руу нэвтрэхгүй. */
create or replace function public.admin_update_user(p_id uuid, p_name text, p_permissions text[])
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_perms text[] := coalesce(p_permissions, '{}');
begin
  perform public.require_users_perm();
  if p_id = auth.uid() and not ('users' = any(v_perms)) then
    raise exception 'Өөрийн "Хэрэглэгч удирдах" эрхийг хасах боломжгүй' using errcode = '42501';
  end if;

  insert into public.profiles (id, email, name, role, permissions)
  select u.id, coalesce(u.email, ''), coalesce(trim(p_name), ''),
         case when cardinality(v_perms) > 0 then 'admin' else 'viewer' end, v_perms
    from auth.users u
   where u.id = p_id
  on conflict (id) do update
    set name = excluded.name, role = excluded.role, permissions = excluded.permissions;

  if not found then
    raise exception 'Хэрэглэгч олдсонгүй' using errcode = 'P0002';
  end if;
end;
$$;

/**
 * Нууц үг солих — өөрийнхөө, эсвэл "users" эрхтэй бол бусдын.
 * Бусдын нууц үгийг сольсон бол тэр хэрэглэгчийн нээлттэй нэвтрэлтүүд хаагдана.
 */
create or replace function public.admin_set_password(p_id uuid, p_password text)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or (p_id <> auth.uid() and not public.has_perm('users')) then
    raise exception 'Нууц үг солих эрх алга' using errcode = '42501';
  end if;
  perform public.check_new_password(p_password);

  update auth.users
     set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
         updated_at = now()
   where id = p_id;
  if not found then
    raise exception 'Хэрэглэгч олдсонгүй' using errcode = 'P0002';
  end if;

  if p_id <> auth.uid() then
    begin
      delete from auth.sessions where user_id = p_id;
    exception when undefined_table then null;
    end;
  end if;
end;
$$;

/** Хэрэглэгчийг бүрмөсөн устгана. Өөрийгөө устгах боломжгүй. */
create or replace function public.admin_delete_user(p_id uuid)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  perform public.require_users_perm();
  if p_id = auth.uid() then
    raise exception 'Өөрийгөө устгах боломжгүй' using errcode = '42501';
  end if;
  delete from auth.users where id = p_id;
  if not found then
    raise exception 'Хэрэглэгч олдсонгүй' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
revoke all on function public.admin_create_user(text, text, text, text[]) from public, anon;
revoke all on function public.admin_update_user(uuid, text, text[]) from public, anon;
revoke all on function public.admin_set_password(uuid, text) from public, anon;
revoke all on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.admin_list_users() to authenticated;
grant execute on function public.admin_create_user(text, text, text, text[]) to authenticated;
grant execute on function public.admin_update_user(uuid, text, text[]) to authenticated;
grant execute on function public.admin_set_password(uuid, text) to authenticated;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- ------------------------------------------------- baatarkhuu.ch@lift.mn

-- Supabase дээр үүсгэсэн хэрэглэгчийг бүрэн эрхтэй админ болгоно
insert into public.profiles (id, email, name, role, permissions)
select id, email, '', 'admin',
       array['requests', 'quotes', 'naadam', 'elevators', 'products', 'users']
  from auth.users
 where lower(email) = 'baatarkhuu.ch@lift.mn'
on conflict (id) do update
  set role = 'admin',
      permissions = array['requests', 'quotes', 'naadam', 'elevators', 'products', 'users'];
