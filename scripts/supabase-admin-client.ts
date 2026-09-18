import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Secret түлхүүртэй клиент.
 *
 * Энэ түлхүүр Row Level Security-г бүхэлд нь тойрдог — өгөгдлийн сангийн
 * бүрэн эрх. ЗӨВХӨН энэ компьютер дээр, терминалаас ажиллуулах скриптэд
 * ашиглана. Хөтөч рүү илгээх код дотор хэзээ ч бичиж болохгүй.
 *
 * Шинэ хэлбэр (sb_secret_...) болон хуучин service_role JWT хоёулаа ажиллана.
 */
/** .env.example доторх жишээ утга (`xxxxxxxx`) -ийг бөглөгдөөгүйд тооцно */
export function filled(value?: string): string | undefined {
  if (!value) return undefined;
  const v = value.trim();
  if (!v || /x{8,}/i.test(v) || v.endsWith('...')) return undefined;
  return v;
}

export function serviceClient(): SupabaseClient {
  const url = filled(process.env.SUPABASE_URL) || filled(process.env.VITE_SUPABASE_URL);
  const key =
    filled(process.env.SUPABASE_SECRET_KEY) || filled(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!url) {
    console.error(
      'VITE_SUPABASE_URL алга эсвэл жишээ утга хэвээр байна.\n' +
        'Supabase Dashboard дээрх Connect товч, эсвэл Settings -> Data API\n' +
        'хэсгээс авна. Олдохгүй бол хөтчийн хаяг дахь\n' +
        '.../project/АБВГД/... доторх АБВГД-г аваад https://АБВГД.supabase.co\n' +
        'болгож .env файлд бөглөнө үү.'
    );
    process.exit(1);
  }
  if (!key) {
    console.error(
      'SUPABASE_SECRET_KEY алга эсвэл жишээ утга хэвээр байна.\n' +
        'Supabase Dashboard -> Project Settings -> API Keys -> Secret keys хэсгээс\n' +
        'sb_secret_... түлхүүрийг хуулж .env файлд бөглөнө үү.\n' +
        '(Хуучин хэлбэр ашиглаж байвал SUPABASE_SERVICE_ROLE_KEY ч болно.)\n' +
        'Энэ түлхүүрийг хэнд ч бүү дамжуулаарай.'
    );
    process.exit(1);
  }

  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
