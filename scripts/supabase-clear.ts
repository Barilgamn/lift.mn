import { serviceClient } from './supabase-admin-client.js';

/**
 * Жишээ өгөгдлийг цэвэрлэх.
 *
 *   npm run supabase:clear          — юу устахыг харуулна (устгахгүй)
 *   npm run supabase:clear -- --yes — үнэхээр устгана
 *
 * Устгах хүснэгтүүд: submissions, service_records, elevators.
 *
 * ХӨНДӨХГҮЙ:
 *   products — каталог хэвээрээ үлдэнэ (шинэчлэхийг хүсвэл
 *              `npm run supabase:seed -- --replace-products`).
 *   profiles — нэвтрэх эрхтэй админ хэрэглэгчид. Үүнийг устгавал
 *              та өөрөө админ хуудас руу орж чадахаа болино.
 *
 * Устгасан өгөгдлийг буцаах боломжгүй.
 */

/** Цэвэрлэх хүснэгтүүд — гадаад түлхүүрийн дарааллаар (хүүхэд нь эхэлнэ) */
const TABLES = ['submissions', 'service_records', 'elevators'] as const;

/** Хөндөхгүй хүснэгтүүд — зөвхөн мэдээлэл харуулахад */
const KEPT = ['products', 'profiles'] as const;

const CONFIRMED = process.argv.includes('--yes');

async function countOf(sb: ReturnType<typeof serviceClient>, table: string): Promise<number> {
  const { count, error } = await sb.from(table).select('*', { count: 'exact', head: true });
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

async function main() {
  const sb = serviceClient();

  console.log('\nОдоогийн байдал\n');
  const before: Record<string, number> = {};
  for (const t of TABLES) {
    before[t] = await countOf(sb, t);
    console.log(`  ${t.padEnd(16)} ${String(before[t]).padStart(5)}  → устана`);
  }
  for (const t of KEPT) {
    const n = await countOf(sb, t);
    console.log(`  ${t.padEnd(16)} ${String(n).padStart(5)}  → хэвээр үлдэнэ`);
  }

  const total = TABLES.reduce((sum, t) => sum + before[t], 0);

  if (total === 0) {
    console.log('\nУстгах бүртгэл алга. Бааз аль хэдийн цэвэр байна.\n');
    return;
  }

  if (!CONFIRMED) {
    console.log(
      `\nНийт ${total} мөр устгахаар байна. Одоохондоо ЮУ Ч УСТГААГҮЙ.\n` +
        'Үнэхээр устгах бол:\n\n' +
        '  npm run supabase:clear -- --yes\n\n' +
        'Устгасан өгөгдлийг буцаах боломжгүйг анхаарна уу.\n'
    );
    return;
  }

  console.log('\nУстгаж байна…\n');
  for (const t of TABLES) {
    if (before[t] === 0) {
      console.log(`  ${t.padEnd(16)} аль хэдийн хоосон`);
      continue;
    }
    // PostgREST шүүлтгүй delete-ийг зөвшөөрдөггүй тул "бүх мөр" гэдгийг
    // `not.is.null` шүүлтээр илэрхийлнэ. id нь бүх хүснэгтэд not null.
    const { error } = await sb.from(t).delete().not('id', 'is', null);
    if (error) throw new Error(`${t} цэвэрлэхэд: ${error.message}`);
    const left = await countOf(sb, t);
    console.log(`  ${t.padEnd(16)} ${String(before[t]).padStart(5)} устгав, ${left} үлдлээ`);
  }

  console.log(
    '\nДууслаа. Одоо админ хэсгээс шинэ лифт, бүртгэлээ гараар нэмж болно.\n' +
      'Каталог (бүтээгдэхүүн) болон админ хэрэглэгч хэвээрээ байгаа.\n'
  );
}

main().catch((e) => {
  console.error('\nАлдаа:', e instanceof Error ? e.message : e, '\n');
  process.exit(1);
});
