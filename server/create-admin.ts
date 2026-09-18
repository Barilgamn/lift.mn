import 'dotenv/config';
import readline from 'node:readline/promises';
import { db, migrate } from './db.js';
import { createUser, hashPassword } from './auth.js';

/**
 * Админ хэрэглэгч үүсгэх.
 *
 * Нууц үгийг кодод бичихгүй — тушаалын мөрөөр эсвэл асуултаар авна.
 *   npm run create-admin -- --email=ochir@lift.mn --name="Очир" --password=...
 * Нууц үгийг өгөөгүй бол асууна (терминалд бичихэд харагдахгүй).
 */

migrate();

const arg = (name: string): string | undefined => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3);
};

async function ask(question: string, hidden = false): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  if (!hidden) {
    const a = await rl.question(question);
    rl.close();
    return a.trim();
  }
  // Нууц үг бичихэд дэлгэцэнд гаргахгүй
  const stdout = process.stdout as NodeJS.WriteStream & { _writeToOutput?: (s: string) => void };
  const iface = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
  const original = iface._writeToOutput?.bind(iface);
  iface._writeToOutput = (s: string) => {
    if (s.includes(question)) original?.(s);
    else iface.output.write('*');
  };
  const a = await rl.question(question);
  rl.close();
  stdout.write('\n');
  return a.trim();
}

const MIN_PASSWORD = 10;

async function main() {
  const email = arg('email') || (await ask('Имэйл: '));
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    console.error('Имэйл хаяг буруу байна.');
    process.exit(1);
  }

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (exists) {
    console.error(`${email} хаягтай хэрэглэгч аль хэдийн бүртгэлтэй байна.`);
    process.exit(1);
  }

  const name = arg('name') || (await ask('Нэр: '));
  if (!name) {
    console.error('Нэр шаардлагатай.');
    process.exit(1);
  }

  const password = arg('password') || (await ask(`Нууц үг (доод тал нь ${MIN_PASSWORD} тэмдэгт): `, true));
  if (password.length < MIN_PASSWORD) {
    console.error(`Нууц үг хэт богино байна. Доод тал нь ${MIN_PASSWORD} тэмдэгт.`);
    process.exit(1);
  }

  const user = createUser(email, name, await hashPassword(password));
  console.log(`\nАдмин үүслээ: ${user.name} <${user.email}>`);
  console.log('Одоо /admin хаягаар нэвтэрнэ үү.\n');
}

main().catch((e) => {
  console.error('Алдаа:', e instanceof Error ? e.message : e);
  process.exit(1);
});
