-- =========================================================================
-- Спортын наадам — багийн мэдүүлэг хадгалах Storage сан
--
-- Supabase Dashboard -> SQL Editor -> New query дотор бүтнээр нь хуулж
-- Run дарна. Дахин ажиллуулахад аюулгүй (schema.sql-д мөн багтсан).
--
--   - Сан хувийн (public = false): файлыг зөвхөн админ түр холбоосоор татна
--   - Зочин зөвхөн НЭМЭХ эрхтэй — бусдын файлыг харах, устгах боломжгүй
--   - Зөвхөн Word / PDF, нэг файл 20 МБ хүртэл
-- =========================================================================

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
