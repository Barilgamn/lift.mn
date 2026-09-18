import 'dotenv/config';
import { existsSync } from 'node:fs';
import { filled } from './supabase-admin-client.js';

/**
 * .env файлын төлөвийг шалгаж харуулна.
 *
 *   npm run supabase:check
 *
 * Аль мөр бөглөгдсөн, аль нь дутууг харуулна. Нууц утгыг бүтнээр нь
 * хэвлэхгүй — зөвхөн эхний хэдэн тэмдэгт болон уртыг харуулна.
 */

const ok = (s: string) => `\x1b[32m✓\x1b[0m ${s}`;
const bad = (s: string) => `\x1b[31m✗\x1b[0m ${s}`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

/** Нууц утгыг таниж болохоор, гэхдээ ашиглаж болохооргүй хэлбэрт оруулна */
function mask(value: string, visible = 14): string {
  if (value.length <= visible) return `${value} ${dim(`(${value.length} тэмдэгт)`)}`;
  return `${value.slice(0, visible)}… ${dim(`(${value.length} тэмдэгт)`)}`;
}

type Check = {
  label: string;
  names: string[];
  required: boolean;
  where: string;
  secret?: boolean;
};

const CHECKS: Check[] = [
  {
    label: 'Төслийн хаяг',
    names: ['VITE_SUPABASE_URL'],
    required: true,
    where: 'Dashboard дээрх Connect товч, эсвэл Settings → Data API',
  },
  {
    label: 'Хөтчийн түлхүүр',
    names: ['VITE_SUPABASE_PUBLISHABLE_KEY', 'VITE_SUPABASE_ANON_KEY'],
    required: true,
    where: 'Settings → API Keys → Publishable key → default',
  },
  {
    label: 'Терминалын түлхүүр',
    names: ['SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
    required: true,
    where: 'Settings → API Keys → Secret keys → default (👁 дарж харуулна)',
    secret: true,
  },
  {
    label: 'Өгөгдлийн сангийн холболт',
    names: ['SUPABASE_DB_URL'],
    required: false,
    where: 'Dashboard дээрх Connect товч (заавал биш)',
    secret: true,
  },
];

function main() {
  console.log('\n\x1b[1mLIFT.MN · .env шалгалт\x1b[0m\n' + '─'.repeat(30));

  if (!existsSync('.env')) {
    console.error(
      bad('.env файл алга.\n') +
        '\nҮүсгэхийн тулд:\n  cp .env.example .env\n  open -e .env\n'
    );
    process.exit(1);
  }

  let missing = 0;

  for (const check of CHECKS) {
    const hit = check.names.map((n) => [n, filled(process.env[n])] as const).find(([, v]) => v);

    if (hit) {
      const [name, value] = hit;
      const shown = check.secret ? mask(value!, 10) : mask(value!, 30);
      console.log(`\n${ok(check.label)}`);
      console.log(dim(`  ${name}`));
      console.log(`  ${shown}`);
      continue;
    }

    if (!check.required) {
      console.log(`\n${dim('—')} ${check.label} ${dim('(заавал биш)')}`);
      console.log(dim(`  ${check.names[0]} — бөглөгдөөгүй`));
      continue;
    }

    missing += 1;
    console.log(`\n${bad(check.label)}`);
    console.log(dim(`  ${check.names[0]} — бөглөгдөөгүй эсвэл жишээ утга хэвээр`));
    console.log(dim(`  Хаанаас: ${check.where}`));
  }

  console.log('\n' + '─'.repeat(30));

  if (missing > 0) {
    console.error(
      `\n${missing} утга дутуу байна.\n\n` +
        '  open -e .env\n\n' +
        'гэж бичээд дутуу мөрүүдийг бөглөөд Cmd+S дарж хадгална.\n' +
        'Дараа нь серверээ дахин асаана (Control+C, дараа нь npm run dev).\n'
    );
    process.exit(1);
  }

  console.log('\nБүх утга бөглөгдсөн байна.\n');
}

main();
