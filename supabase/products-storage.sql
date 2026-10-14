-- =========================================================================
-- Бүтээгдэхүүний зураг хадгалах Storage сан
--
-- Supabase Dashboard -> SQL Editor -> New query дотор бүтнээр нь хуулж
-- Run дарна. Дахин ажиллуулахад аюулгүй (schema.sql-д мөн багтсан).
--
--   - Сан нийтийн (public = true): сайтын зочид зургийг шууд харна
--   - Зөвхөн админ зураг нэмэх, солих, устгах эрхтэй
--   - Зөвхөн WebP / JPEG / PNG, нэг файл 5 МБ хүртэл (хөтөч өмнө нь шахдаг)
-- =========================================================================

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
