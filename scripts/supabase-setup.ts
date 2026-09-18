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

/** Хүснэгтүүд үүссэн эсэхийг REST-ээр шалгах */
async function schemaExists(): Promise<boolean> {
  const sb = serviceClient();
  const { error } = await sb.from('profiles').select('id', { count: 'exact', head: true });
  if (!error) return true;
  if (/does not exist|schema cache|Could not find the table/i.test(error.message)) return false;
  if (/fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(error.message)) {
    throw new Error(
      'Supabase рүү холбогдож чадсангүй.\n' +
        'Интернэт холболтоо, мөн .env доторх SUPABASE_URL зөв эсэхийг шалгана уу.'
    );
  }
  if (/Invalid API key|JWT|apikey/i.test(error.message)) {
    throw new Error(
      'Түлхүүр буруу байна.\n' +
        'SUPABASE_SECRET_KEY нь sb_secret_... хэлбэртэй, SUPABASE_URL-тэй ижил\n' +
        'төсөл дээрх байх ёстой (Dashboard -> Project Settings -> API Keys).'
    );
  }
  throw new Error(error.message);
}

async function main() {
  console.log('\nLIFT.MN · Supabase тохируулга\n' + '─'.repeat(32));

  const dbUrl = process.env.SUPABASE_DB_URL;

  step(1, 'Хүснэгт ба эрхийн бодлого');
  if (has('skip-schema')) {
    console.log('--skip-schema өгсөн тул алгаслаа.');
  } else if (dbUrl) {
    await applySchema(dbUrl);
  } else if (await schemaExists()) {
    console.log('Хүснэгтүүд аль хэдийн байна — алгаслаа.');
  } else {
    console.error(
      '\nХүснэгтүүд хараахан үүсээгүй байна.\n\n' +
        'Хоёр сонголт:\n\n' +
        '  A) Гараар — Supabase Dashboard -> SQL Editor -> New query нээгээд\n' +
        `     ${path.relative(process.cwd(), SCHEMA_PATH)} файлыг бүхэлд нь хуулж тавиад Run дарна.\n` +
        '     Дараа нь энэ тушаалаа дахин ажиллуулна.\n\n' +
        '  B) Автоматаар — Dashboard -> Connect дээрх холболтын мөрийг\n' +
        '     .env файлд SUPABASE_DB_URL нэрээр бичээд дахин ажиллуулна.\n'
    );
    process.exit(1);
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
