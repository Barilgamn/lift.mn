import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase клиент — шаардлагатай үед нь ачаална.
 *
 * supabase-js нь ~215 КБ. Үүнийг үндсэн багцад оруулбал сайтын зочин
 * бүр татах болно. Тиймээс `import()`-оор тусад нь ачаалж, зөвхөн
 * хэрэгтэй хуудсанд (дэлгүүр, админ) татагдана.
 *
 * Publishable түлхүүр (sb_publishable_...) нь нийтэд харагддаг тул нууц
 * биш. Өгөгдлийг хамгаалдаг зүйл нь түлхүүр биш, харин өгөгдлийн сан
 * дээрх Row Level Security бодлого. Secret түлхүүрийг (sb_secret_...)
 * хөтөч рүү ХЭЗЭЭ Ч оруулж болохгүй.
 */

/**
 * .env.example доторх жишээ утгыг бөглөгдөөгүйд тооцно.
 *
 * Хэрэглэгч гурван мөрийн заримыг нь л сольсон тохиолдолд үлдсэн `xxxxxxxx`
 * утга нь жинхэнэ түлхүүрийг дарж болзошгүй. Мөн түлхүүрийг бүтнээр нь
 * хуулаагүй (төгсгөлд нь `...` үлдсэн) тохиолдлыг ч энд барина.
 */
function filled(value?: string): string | undefined {
  if (!value) return undefined;
  const v = value.trim();
  if (!v || /x{8,}/i.test(v) || v.endsWith('...')) return undefined;
  return v;
}

const url = filled(import.meta.env.VITE_SUPABASE_URL);

// Supabase-ийн шинэ түлхүүр (sb_publishable_...), эсвэл хуучин anon JWT.
// Хоёулаа ажиллана — хуучин төслүүд эвдрэхгүйн тулд аль алиныг нь дэмжив.
const publishableKey =
  filled(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  filled(import.meta.env.VITE_SUPABASE_ANON_KEY);

/** Тохиргоо хийгдсэн эсэх. Энэ шалгалт supabase-js-ийг татахгүй. */
export const isSupabaseConfigured = Boolean(url && publishableKey);

let clientPromise: Promise<SupabaseClient> | null = null;

/** Клиентийг нэг л удаа үүсгэж, дараа нь дахин ашиглана */
export function getSupabase(): Promise<SupabaseClient> {
  if (!isSupabaseConfigured) {
    return Promise.reject(
      new Error(
        'Supabase тохируулагдаагүй байна. .env файлд VITE_SUPABASE_URL болон ' +
          'VITE_SUPABASE_PUBLISHABLE_KEY-г бөглөнө үү.'
      )
    );
  }
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url!, publishableKey!, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      })
    );
  }
  return clientPromise;
}

/** Supabase-ийн алдааг монголоор ойлгомжтой болгох */
export function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e ?? '');
  if (/Invalid login credentials/i.test(msg)) return 'Имэйл эсвэл нууц үг буруу байна';
  if (/Email not confirmed/i.test(msg)) return 'Имэйл хаяг баталгаажаагүй байна';
  if (/rate limit|too many/i.test(msg)) return 'Хэт олон оролдлого. Хэсэг хүлээгээд дахин оролдоно уу';
  if (/Failed to fetch|NetworkError/i.test(msg)) return 'Сервертэй холбогдож чадсангүй. Интернэт холболтоо шалгана уу';
  if (/JWT|session/i.test(msg)) return 'Нэвтрэлтийн хугацаа дууссан байна. Дахин нэвтэрнэ үү';
  if (/row-level security|permission denied/i.test(msg)) return 'Энэ үйлдэлд эрх хүрэхгүй байна';
  return msg || 'Тодорхойгүй алдаа гарлаа';
}
