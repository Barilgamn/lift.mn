import { serviceClient } from './supabase-admin-client.js';
import { SEED_ELEVATORS, SEED_SERVICE_RECORDS, SEED_SUBMISSIONS } from '../src/data/adminData.js';
import { SPARE_PARTS } from '../src/data/mockData.js';
import { CATALOG_PRODUCTS } from '../src/data/catalogData.js';
import { elevatorToRow, productToRow, recordToRow } from '../src/lib/mappers.js';

/**
 * Эхлэлийн жишээ өгөгдөл ачаалах.
 *
 *   npm run supabase:seed
 *
 * Хүснэгт хоосон байвал л ачаална — байгаа өгөгдлийг дарж бичихгүй.
 */

async function main() {
  const sb = serviceClient();

  const isEmpty = async (table: string) => {
    const { count, error } = await sb.from(table).select('*', { count: 'exact', head: true });
    if (error) throw new Error(`${table}: ${error.message}`);
    return (count ?? 0) === 0;
  };

  if (await isEmpty('elevators')) {
    const { error } = await sb.from('elevators').insert(SEED_ELEVATORS.map(elevatorToRow));
    if (error) throw new Error(`elevators: ${error.message}`);
    console.log(`Лифт ${SEED_ELEVATORS.length} ачааллаа`);

    const { error: recError } = await sb
      .from('service_records')
      .insert(SEED_SERVICE_RECORDS.map((r) => recordToRow(r)));
    if (recError) throw new Error(`service_records: ${recError.message}`);
    console.log(`Засварын бүртгэл ${SEED_SERVICE_RECORDS.length} ачааллаа`);
  } else {
    console.log('Лифт аль хэдийн байна — алгаслаа');
  }

  if (await isEmpty('submissions')) {
    const rows = SEED_SUBMISSIONS.map((s) => ({
      id: s.id, kind: s.kind, contact_name: s.contactName, phone: s.phone,
      summary: s.summary, status: s.status, details: s.details,
      created_at: new Date(s.createdAt.replace(' ', 'T') + ':00Z').toISOString(),
    }));
    const { error } = await sb.from('submissions').insert(rows);
    if (error) throw new Error(`submissions: ${error.message}`);
    console.log(`Бүртгэл ${rows.length} ачааллаа`);
  } else {
    console.log('Бүртгэл аль хэдийн байна — алгаслаа');
  }

  if (await isEmpty('products')) {
    const all = [...CATALOG_PRODUCTS, ...SPARE_PARTS];
    // Зураг нь /public дотор файл байдаг тул мөр хөнгөн — багцлах шаардлагагүй
    const { error } = await sb.from('products').insert(all.map(productToRow));
    if (error) throw new Error(`products: ${error.message}`);
    const variants = CATALOG_PRODUCTS.reduce((n, p) => n + (p.variants?.length ?? 0), 0);
    console.log(`Бүтээгдэхүүн ${all.length} ачааллаа (каталогийн ${variants} загвар)`);
  } else {
    console.log('Бүтээгдэхүүн аль хэдийн байна — алгаслаа');
  }

  console.log('Дууслаа.');
}

main().catch((e) => {
  console.error('Алдаа:', e instanceof Error ? e.message : e);
  process.exit(1);
});
