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
export function serviceClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    console.error('SUPABASE_URL алга. .env файлд бөглөнө үү.');
    process.exit(1);
  }
  if (!key) {
    console.error(
      'SUPABASE_SECRET_KEY алга.\n' +
        'Supabase Dashboard -> Project Settings -> API Keys -> Secret keys хэсгээс\n' +
        'sb_secret_... түлхүүрийг хуулж .env файлд бөглөнө үү.\n' +
        'Энэ түлхүүрийг хэнд ч бүү дамжуулаарай.'
    );
    process.exit(1);
  }

  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
