import 'dotenv/config';
import { existsSync } from 'node:fs';
import { serviceClient } from './supabase-admin-client.js';

/**
 * Өгөгдлийн сангийн одоогийн байдлыг шалгаж харуулна.
 *
 *   npm run supabase:status
 *
 * Ачаалалт болсон эсэх, юу дутуу байгааг олж харахад зориулагдсан.
 * Нууц утга хэвлэхгүй — гаралтыг хуваалцахад аюулгүй.
 */

const ok = (s: string) => `\x1b[32m✓\x1b[0m ${s}`;
const bad = (s: string) => `\x1b[31m✗\x1b[0m ${s}`;
const warn = (s: string) => `\x1b[33m!\x1b[0m ${s}`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const head = (s: string) => `\n\x1b[1m${s}\x1b[0m\n${'─'.repeat(s.length)}`;

type Variant = { code?: string; price?: number; stockCount?: number; image?: string };
type Product = {
  id: string; name: string; price: number; stock_count: number;
  image: string; variants: Variant[] | null;
};

async function main() {
  const sb = serviceClient();
  console.log('\n\x1b[1mLIFT.MN · өгөгдлийн сангийн байдал\x1b[0m');

  // ── Холболт ────────────────────────────────────────────────
  // Эхлээд нэг удаа шалгана — эс бөгөөс сүлжээ тасарсан үед хэсэг бүр
  // тус тусдаа "fetch failed" гэж хэвлэгдээд шалтгаан нь баригдахгүй
  const probe = await sb.from('profiles').select('id', { count: 'exact', head: true });
  if (probe.error) {
    const m = probe.error.message;
    if (/fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(m)) {
      console.error(
        '\n' + bad('Supabase рүү холбогдож чадсангүй.') +
        '\nИнтернэт холболтоо, мөн .env доторх VITE_SUPABASE_URL зөв эсэхийг шалгана уу.\n'
      );
      process.exit(1);
    }
    if (/Invalid API key|JWT|apikey/i.test(m)) {
      console.error(
        '\n' + bad('Түлхүүр буруу байна.') +
        '\nSUPABASE_SECRET_KEY нь VITE_SUPABASE_URL-тэй ижил төсөл дээрх байх ёстой.\n'
      );
      process.exit(1);
    }
    if (/does not exist|schema cache|Could not find the table/i.test(m)) {
      console.error(
        '\n' + bad('Хүснэгтүүд үүсээгүй байна.') +
        '\nsupabase/schema.sql-ийг SQL Editor дээр ажиллуулна уу.\n'
      );
      process.exit(1);
    }
  }

  // ── Хүснэгтийн тоо ─────────────────────────────────────────
  console.log(head('Хүснэгтүүд'));
  const tables = ['profiles', 'elevators', 'service_records', 'submissions', 'products'] as const;
  for (const t of tables) {
    const { count, error } = await sb.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(bad(`${t.padEnd(16)} ${error.message}`));
      continue;
    }
    const n = count ?? 0;
    console.log((n > 0 ? ok : warn)(`${t.padEnd(16)} ${n} мөр`));
  }

  // ── Админ хэрэглэгч ────────────────────────────────────────
  const { data: admins } = await sb.from('profiles').select('email, role').eq('role', 'admin');
  console.log(head('Админ хэрэглэгч'));
  if (!admins?.length) {
    console.log(bad('Админ эрхтэй хэрэглэгч алга — npm run supabase:create-admin'));
  } else {
    for (const a of admins) console.log(ok(a.email));
  }

  // ── Бүтээгдэхүүн ───────────────────────────────────────────
  console.log(head('Бүтээгдэхүүн'));
  const { data, error } = await sb
    .from('products')
    .select('id, name, price, stock_count, image, variants')
    .order('name');

  if (error) {
    console.log(bad(error.message));
    if (/variants/.test(error.message)) {
      console.log(dim('\n  variants багана дутуу байна. SQL Editor дээр:'));
      console.log("  alter table public.products add column if not exists variants jsonb not null default '[]'::jsonb;");
    }
    process.exit(1);
  }

  const products = (data ?? []) as Product[];
  const withVariants = products.filter((p) => (p.variants?.length ?? 0) > 0);
  const totalVariants = products.reduce((n, p) => n + (p.variants?.length ?? 0), 0);

  console.log(`${products.length} бүтээгдэхүүн, ${withVariants.length} нь загвартай, нийт ${totalVariants} загвар`);

  // Үнэ тавигдсан эсэх
  const priced = products.reduce(
    (n, p) => n + (p.variants?.length ? p.variants.filter((v) => (v.price ?? 0) > 0).length : (p.price > 0 ? 1 : 0)),
    0
  );
  const items = totalVariants + products.filter((p) => !p.variants?.length).length;
  console.log(
    priced === 0
      ? warn(`Үнэ тавигдсан нэгж: 0 / ${items} — бүгд "үнэ тохиролцоно" гэж харагдана`)
      : ok(`Үнэ тавигдсан нэгж: ${priced} / ${items}`)
  );

  // Нөөц
  const inStock = products.reduce(
    (n, p) => n + (p.variants?.length ? p.variants.filter((v) => (v.stockCount ?? 0) > 0).length : (p.stock_count > 0 ? 1 : 0)),
    0
  );
  console.log(dim(`Нөөцтэй нэгж: ${inStock} / ${items}`));

  // ── Зураг ──────────────────────────────────────────────────
  console.log(head('Зураг'));
  const localPaths = new Set<string>();
  let remote = 0, embedded = 0, empty = 0;

  const note = (src?: string) => {
    if (!src) { empty += 1; return; }
    if (src.startsWith('data:')) { embedded += 1; return; }
    if (src.startsWith('/')) { localPaths.add(src); return; }
    remote += 1;
  };
  for (const p of products) {
    note(p.image);
    for (const v of p.variants ?? []) note(v.image);
  }

  const missing = [...localPaths].filter((p) => !existsSync(`public${p}`));
  console.log(`${localPaths.size} файлын зам · ${remote} гадаад линк · ${embedded} шингэсэн · ${empty} зураггүй`);
  if (missing.length) {
    console.log(bad(`${missing.length} зам public/ дотор олдсонгүй:`));
    missing.slice(0, 5).forEach((m) => console.log(`   ${m}`));
    console.log(dim('  Кодоо шинэчилсэн эсэхээ шалгана уу: git pull'));
  } else if (localPaths.size) {
    console.log(ok('Бүх файлын зам байна'));
  }

  // ── Жагсаалт ───────────────────────────────────────────────
  console.log(head('Жагсаалт'));
  for (const p of products) {
    const n = p.variants?.length ?? 0;
    const label = n ? `${String(n).padStart(3)} загвар` : '  энгийн бараа';
    console.log(`  ${label}  ${p.name}`);
  }

  // ── Маягтын хүсэлт ─────────────────────────────────────────
  const { data: subs } = await sb
    .from('submissions')
    .select('kind, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  if (subs?.length) {
    console.log(head('Сүүлийн хүсэлтүүд'));
    for (const s of subs) {
      console.log(`  ${String(s.created_at).slice(0, 16).replace('T', ' ')}  ${String(s.kind).padEnd(15)} ${s.status}`);
    }
  }

  console.log('');
}

main().catch((e) => {
  console.error('\nАлдаа:', e instanceof Error ? e.message : e);
  process.exit(1);
});
