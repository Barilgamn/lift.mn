-- =========================================================================
-- CRM — харилцагч байгууллага (СӨХ, хамтрагч), холбогдох хүн, хэлцэл,
-- үйл ажиллагаа (тэмдэглэл, дуудлага, уулзалт, ажил)
--
-- Supabase Dashboard -> SQL Editor -> New query дотор бүтнээр нь хуулж
-- Run дарна. Дахин ажиллуулахад аюулгүй (schema.sql-д мөн багтсан).
-- supabase/admin-users.sql өмнө нь ажилласан байх ёстой (has_perm).
--
--   - Шинэ "crm" эрх. Бүрэн эрхтэй админууд (users эрхтэй) автоматаар авна.
--   - Засварын хүсэлт, лифтийг байгууллагатай холбоно (company_id).
-- =========================================================================

-- ------------------------------------------------------------ crm эрх

do $$
begin
  -- Эрхийн жагсаалтад crm анх нэмэгдэж байгаа үед л бүрэн эрхтэй админуудад олгоно
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_permissions_check'
      and pg_get_constraintdef(oid) like '%crm%'
  ) then
    alter table public.profiles drop constraint if exists profiles_permissions_check;
    alter table public.profiles add constraint profiles_permissions_check
      check (permissions <@ array['requests', 'quotes', 'naadam', 'elevators', 'products', 'users', 'crm']::text[]);
    update public.profiles
       set permissions = array_append(permissions, 'crm')
     where role = 'admin' and 'users' = any(permissions) and not ('crm' = any(permissions));
  end if;
end $$;

-- ------------------------------------------------------------ хүснэгтүүд

create table if not exists public.crm_companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 200),
  -- soh: СӨХ, partner: хамтрагч, company: байгууллага/барилга,
  -- government: төрийн байгууллага, individual: хувь хүн
  kind        text not null default 'company'
              check (kind in ('soh', 'partner', 'company', 'government', 'individual')),
  -- lead: боломжит, prospect: яриа хэлэлцээр, customer: гэрээт, inactive: идэвхгүй
  stage       text not null default 'lead'
              check (stage in ('lead', 'prospect', 'customer', 'inactive')),
  reg_no      text not null default '',
  phone       text not null default '',
  email       text not null default '',
  website     text not null default '',
  address     text not null default '',
  district    text not null default '',
  notes       text not null default '',
  tags        text[] not null default '{}',
  owner_id    uuid references auth.users(id) on delete set null,
  created_by  uuid references auth.users(id) on delete set null default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_crm_companies_name on public.crm_companies (lower(name));

create table if not exists public.crm_contacts (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid references public.crm_companies(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 200),
  position    text not null default '',
  phone       text not null default '',
  email       text not null default '',
  notes       text not null default '',
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists idx_crm_contacts_company on public.crm_contacts (company_id);

create table if not exists public.crm_deals (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.crm_companies(id) on delete cascade,
  contact_id     uuid references public.crm_contacts(id) on delete set null,
  title          text not null check (char_length(title) between 1 and 200),
  kind           text not null default 'service-contract'
                 check (kind in ('service-contract', 'repair', 'parts', 'installation', 'modernization', 'other')),
  amount         numeric(14, 0) not null default 0 check (amount >= 0),
  stage          text not null default 'new'
                 check (stage in ('new', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  expected_close date,
  owner_id       uuid references auth.users(id) on delete set null,
  notes          text not null default '',
  submission_id  text references public.submissions(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  closed_at      timestamptz
);

create index if not exists idx_crm_deals_company on public.crm_deals (company_id);
create index if not exists idx_crm_deals_stage on public.crm_deals (stage);

create table if not exists public.crm_activities (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid references public.crm_companies(id) on delete cascade,
  deal_id     uuid references public.crm_deals(id) on delete cascade,
  contact_id  uuid references public.crm_contacts(id) on delete set null,
  kind        text not null default 'note'
              check (kind in ('note', 'call', 'meeting', 'email', 'task', 'system')),
  body        text not null default '' check (char_length(body) <= 5000),
  due_at      timestamptz,
  done        boolean not null default false,
  assignee_id uuid references auth.users(id) on delete set null,
  created_by  uuid references auth.users(id) on delete set null default auth.uid(),
  created_at  timestamptz not null default now()
);

create index if not exists idx_crm_activities_company on public.crm_activities (company_id, created_at desc);
create index if not exists idx_crm_activities_due on public.crm_activities (due_at) where kind = 'task' and not done;

-- Хүсэлт, лифтийг байгууллагатай холбох
alter table public.submissions add column if not exists company_id uuid
  references public.crm_companies(id) on delete set null;
alter table public.elevators add column if not exists company_id uuid
  references public.crm_companies(id) on delete set null;
create index if not exists idx_submissions_company on public.submissions (company_id);
create index if not exists idx_elevators_company on public.elevators (company_id);

/** updated_at-г автоматаар шинэчилнэ; хэлцэл хаагдахад closed_at тавина */
create or replace function public.crm_touch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  if tg_table_name = 'crm_deals' then
    if new.stage in ('won', 'lost') and (tg_op = 'INSERT' or old.stage not in ('won', 'lost')) then
      new.closed_at := now();
    elsif new.stage not in ('won', 'lost') then
      new.closed_at := null;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists crm_companies_touch on public.crm_companies;
create trigger crm_companies_touch before insert or update on public.crm_companies
  for each row execute function public.crm_touch();
drop trigger if exists crm_deals_touch on public.crm_deals;
create trigger crm_deals_touch before insert or update on public.crm_deals
  for each row execute function public.crm_touch();

-- ------------------------------------------------------------ RLS

alter table public.crm_companies enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.crm_deals enable row level security;
alter table public.crm_activities enable row level security;

drop policy if exists "crm_companies: crm all" on public.crm_companies;
create policy "crm_companies: crm all" on public.crm_companies for all to authenticated
  using (public.has_perm('crm')) with check (public.has_perm('crm'));

drop policy if exists "crm_contacts: crm all" on public.crm_contacts;
create policy "crm_contacts: crm all" on public.crm_contacts for all to authenticated
  using (public.has_perm('crm')) with check (public.has_perm('crm'));

drop policy if exists "crm_deals: crm all" on public.crm_deals;
create policy "crm_deals: crm all" on public.crm_deals for all to authenticated
  using (public.has_perm('crm')) with check (public.has_perm('crm'));

drop policy if exists "crm_activities: crm all" on public.crm_activities;
create policy "crm_activities: crm all" on public.crm_activities for all to authenticated
  using (public.has_perm('crm')) with check (public.has_perm('crm'));

-- CRM ажилтан байгууллагын хүсэлт (наадмаас бусад), лифтийг харна
drop policy if exists "submissions: crm read" on public.submissions;
create policy "submissions: crm read" on public.submissions for select to authenticated
  using (
    public.has_perm('crm')
    and not (kind = 'booking' and details ->> 'Төрөл' = 'Спортын наадам 2026')
  );

drop policy if exists "elevators: crm read" on public.elevators;
create policy "elevators: crm read" on public.elevators for select to authenticated
  using (public.has_perm('crm'));

-- ------------------------------------------------------------ функцүүд

/** Хүсэлтийг байгууллагатай холбох / салгах (зөвхөн company_id-г өөрчилнө) */
create or replace function public.crm_link_submission(p_submission text, p_company uuid)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  if not public.has_perm('crm') then
    raise exception 'CRM эрх алга' using errcode = '42501';
  end if;
  update public.submissions set company_id = p_company
   where id = p_submission
     and not (kind = 'booking' and details ->> 'Төрөл' = 'Спортын наадам 2026');
  if not found then
    raise exception 'Хүсэлт олдсонгүй' using errcode = 'P0002';
  end if;
end;
$$;

/** Лифтийг байгууллагатай холбох / салгах */
create or replace function public.crm_link_elevator(p_elevator text, p_company uuid)
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  if not public.has_perm('crm') then
    raise exception 'CRM эрх алга' using errcode = '42501';
  end if;
  update public.elevators set company_id = p_company where id = p_elevator;
  if not found then
    raise exception 'Лифт олдсонгүй' using errcode = 'P0002';
  end if;
end;
$$;

/** Хариуцагч сонгоход — админ ажилтнуудын нэр (имэйл) */
create or replace function public.crm_staff()
returns table (id uuid, name text, email text)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.has_perm('crm') then
    raise exception 'CRM эрх алга' using errcode = '42501';
  end if;
  return query
    select p.id, coalesce(nullif(p.name, ''), split_part(p.email, '@', 1)), p.email
      from public.profiles p
     where p.role = 'admin' and cardinality(p.permissions) > 0
     order by 2;
end;
$$;

revoke all on function public.crm_link_submission(text, uuid) from public, anon;
revoke all on function public.crm_link_elevator(text, uuid) from public, anon;
revoke all on function public.crm_staff() from public, anon;
grant execute on function public.crm_link_submission(text, uuid) to authenticated;
grant execute on function public.crm_link_elevator(text, uuid) to authenticated;
grant execute on function public.crm_staff() to authenticated;
