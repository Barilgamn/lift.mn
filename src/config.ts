/**
 * Сайтын түр тохиргоо.
 *
 * DELTA LIFT-ийн хэсгүүдийг (нүүрний карт, цэсний холбоос, хөл хэсгийн
 * холбоос, брэндийн бичээс) түр нуусан. Агуулга, код нь бүгд хэвээр —
 * эндээс `true` болгоход бүх газарт буцаж гарна.
 *
 * /delta-lift хаяг нь шууд бичиж орвол ажилласаар байгаа тул засварлах
 * явцдаа урьдчилан харж болно. Сайтын аль ч хэсгээс холбоос заадаггүй.
 */
export const SHOW_DELTA_LIFT = false;

/** Сайтын нэр — лого, зохиогчийн эрхийн мөр, гарчигт */
export const SITE_NAME = 'LIFT.MN';

/**
 * Supabase төслийн нийтийн тохиргоо — env хувьсагч дутуу эсвэл буруу үед
 * ашиглагдана (Vercel, .env аль алинд нь).
 *
 * Энэ хоёр утга НУУЦ БИШ: сайтын зочин бүрийн хөтөч рүү очдог бөгөөд
 * өгөгдлийг Row Level Security бодлого хамгаалдаг. Secret түлхүүрийг
 * (sb_secret_...) энд ХЭЗЭЭ Ч бичиж болохгүй.
 */
export const SUPABASE_PUBLIC = {
  url: 'https://smyolifxglszrskoulsg.supabase.co',
  publishableKey: 'sb_publishable_jTBivEfHg_WxXwfPf5-BKQ_HAXz2r-q',
} as const;
