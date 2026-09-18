import 'dotenv/config';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Client } from 'pg';
import { serviceClient } from './supabase-admin-client.js';

/**
 * Supabase-ийн бүх тохиргоог нэг тушаалаар хийнэ.
 *
 *   npm run supabase:setup
 *
 * Гурван зүйлийг дараалан гүйцэтгэнэ:
 *   1. Хүснэгт, эрхийн бодлогыг үүсгэх (supabase/schema.sql)
 *   2. Эхлэлийн жишээ өгөгдөл ачаалах
 *   3. Админ хэрэглэгч үүсгэх
 *
 * 1-р алхмыг автоматаар хийхэд SUPABASE_DB_URL хэрэгтэй. Байхгүй бол
 * schema.sql-ийг гараар ажиллуулах заавар хэвлээд, хүснэгт бэлэн эсэхийг
 * шалгаад цааш үргэлжилнэ.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMA_PATH = path.join(root, 'supabase', 'schema.sql');

const has = (flag: string) => process.argv.includes(`--${flag}`);

function step(n: number, title: string) {
  console.log(`\n\x1b[1m${n}/3 · ${title}\x1b[0m`);
}

/** Дэд скриптийг ажиллуулж, терминалын оролт гаралтыг дамжуулна */
function run(script: string, args: string[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['tsx', path.join(root, 'scripts', script), ...args], {
      stdio: 'inherit',
      cwd: root,
    });
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${script} ${code} кодоор зогслоо`))
    );
  });
}

/** schema.sql-ийг Postgres руу шууд илгээх */
async function applySchema(dbUrl: string) {
  const sql = readFileSync(SCHEMA_PATH, 'utf8');
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: true } });

  try {
    await client.connect();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`\nӨгөгдлийн сан руу холбогдож чадсангүй: ${msg}\n`);
    if (/certificate|self.signed|SSL/i.test(msg)) {
      console.error(
        'Холболтын гэрчилгээ шалгагдсангүй. SUPABASE_DB_URL-ээ устгаад\n' +
          'schema.sql-ийг Dashboard -> SQL Editor дотор гараар ажиллуулна уу.'
      );
    } else {
      console.error(
        'SUPABASE_DB_URL зөв эсэхийг шалгана уу.\n' +
          'Supabase Dashboard -> Connect -> ORMs / psql хэсэгт байгаа.\n' +
          '[YOUR-PASSWORD] хэсгийг төслийн нууц үгээрээ солих ёстойг анхаарна уу.'
      );
    }
    process.exit(1);
  }

  try {
    await client.query(sql);
    console.log('Хүснэгт, эрхийн бодлогууд бэлэн боллоо.');
  } finally {
    await client.end();
  }
}

/**
 * schema.sql бүрэн ажилласан эсэхийг шалгана.
 *
 * Хүснэгт бүрийг тус тусад нь, мөн profiles-ийн багануудыг шалгах нь чухал:
 * Supabase-ийн бэлэн загвар (User Management) ч `profiles` нэртэй хүснэгт
 * үүсгэдэг тул зөвхөн нэгийг шалгавал буруу дүгнэлт гарна.
 */
const REQUIRED_TABLES = [
  'profiles',
  'elevators',
  'service_records',
  'submissions',
  'products',
] as const;

/** Хүснэгтийн алдааг ойлгомжтой болгох. Хүснэгт байхгүй бол null буцаана. */
function describeError(message: string): Error | null {
  if (/does not exist|schema cache|Could not find the table/i.test(message)) return null;
  if (/fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(message)) {
    return new Error(
      'Supabase рүү холбогдож чадсангүй.\n' +
        'Интернэт холболтоо, мөн .env доторх VITE_SUPABASE_URL зөв эсэхийг шалгана уу.'
    );
  }
  if (/Invalid API key|JWT|apikey/i.test(message)) {
    return new Error(
      'Түлхүүр буруу байна.\n' +
        'SUPABASE_SECRET_KEY нь sb_secret_... хэлбэртэй, VITE_SUPABASE_URL-тэй\n' +
        'ижил төсөл дээрх байх ёстой (Dashboard -> Project Settings -> API Keys).'
    );
  }
  return new Error(message);
}

/** Дутуу хүснэгтийн жагсаалт. Хоосон бол бүгд бэлэн. */
async function missingTables(): Promise<string[]> {
  const sb = serviceClient();
  const missing: string[] = [];

  for (const table of REQUIRED_TABLES) {
    const { error } = await sb.from(table).select('*', { count: 'exact', head: true });
    if (!error) continue;
    const real = describeError(error.message);
    if (real) throw real;
    missing.push(table);
  }

  // Хүснэгт байгаа ч багана нь зөрж болно (өөр загвараар үүссэн бол)
  if (!missing.includes('profiles')) {
    const { error } = await sb.from('profiles').select('id, email, name, role').limit(1);
    if (error && /column|does not exist/i.test(error.message)) {
      throw new Error(
        'public.profiles хүснэгт байгаа ч багана нь тохирохгүй байна:\n' +
          `  ${error.message}\n\n` +
          'Өөр загвараар үүссэн байж магадгүй. SQL Editor дотор\n' +
          '  drop table public.profiles cascade;\n' +
          'ажиллуулаад supabase/schema.sql-ийг дахин ажиллуулна уу.\n' +
          '(Анхаар: тэр хүснэгт дэх өгөгдөл устана.)'
      );
    }
  }

  return missing;
}

async function main() {
  console.log('\nLIFT.MN · Supabase тохируулга\n' + '─'.repeat(32));

  const dbUrl = process.env.SUPABASE_DB_URL;

  step(1, 'Хүснэгт ба эрхийн бодлого');
  if (has('skip-schema')) {
    console.log('--skip-schema өгсөн тул алгаслаа.');
  } else if (dbUrl) {
    await applySchema(dbUrl);
  } else {
    const missing = await missingTables();
    if (missing.length === 0) {
      console.log(`Бүх хүснэгт бэлэн байна (${REQUIRED_TABLES.length}/${REQUIRED_TABLES.length}) — алгаслаа.`);
    } else {
      const ready = REQUIRED_TABLES.length - missing.length;
      console.error(
        `\nДутуу хүснэгт байна (${ready}/${REQUIRED_TABLES.length} бэлэн).\n` +
          `Дутуу: ${missing.join(', ')}\n\n` +
          'supabase/schema.sql-ийг ажиллуулах хэрэгтэй. Хоёр сонголт:\n\n' +
          '  A) Гараар — Supabase Dashboard -> SQL Editor -> New query нээгээд\n' +
          `     ${path.relative(process.cwd(), SCHEMA_PATH)} файлыг бүхэлд нь хуулж тавиад\n` +
          '     Run дарна. Дараа нь энэ тушаалаа дахин ажиллуулна.\n\n' +
          '  B) Автоматаар — Dashboard дээрх Connect товч дарж холболтын мөрийг\n' +
          '     хуулаад .env файлд SUPABASE_DB_URL нэрээр бичиж дахин ажиллуулна.\n\n' +
          'Файлыг terminal дээр нээж хуулах бол:\n' +
          `  open -e ${path.relative(process.cwd(), SCHEMA_PATH)}\n`
      );
      process.exit(1);
    }
  }

  step(2, 'Эхлэлийн өгөгдөл');
  await run('supabase-seed.ts');

  step(3, 'Админ хэрэглэгч');
  const passthrough = process.argv.filter((a) => /^--(email|name|password)=/.test(a));
  await run('supabase-create-admin.ts', passthrough);

  console.log(
    '\n' + '─'.repeat(32) + '\nБүх тохиргоо дууслаа.\n\n' +
      '  npm run dev\n\n' +
      'Дараа нь http://localhost:3000/admin хаягаар нэвтэрнэ үү.\n'
  );
}

main().catch((e) => {
  console.error('\nАлдаа:', e instanceof Error ? e.message : e);
  process.exit(1);
});
