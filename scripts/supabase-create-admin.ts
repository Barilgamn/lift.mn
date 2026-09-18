import readline from 'node:readline/promises';
import { serviceClient } from './supabase-admin-client.js';

/**
 * Админ хэрэглэгч үүсгэх.
 *
 *   npm run supabase:create-admin
 *   npm run supabase:create-admin -- --email=та@lift.mn --name="Нэр" --password=...
 *
 * Хэрэв тухайн имэйл аль хэдийн бүртгэлтэй бол зөвхөн админ эрх олгоно.
 */

const MIN_PASSWORD = 10;

const arg = (name: string) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3);
};

async function ask(question: string, hidden = false): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  if (hidden) {
    const iface = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
    const original = iface._writeToOutput?.bind(iface);
    iface._writeToOutput = (s: string) => {
      if (s.includes(question)) original?.(s);
      else iface.output.write('*');
    };
  }
  const answer = await rl.question(question);
  rl.close();
  if (hidden) process.stdout.write('\n');
  return answer.trim();
}

async function main() {
  const sb = serviceClient();

  const email = arg('email') || (await ask('Имэйл: '));
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    console.error('Имэйл хаяг буруу байна.');
    process.exit(1);
  }

  const name = arg('name') || (await ask('Нэр: '));
  if (!name) {
    console.error('Нэр шаардлагатай.');
    process.exit(1);
  }

  // Имэйл аль хэдийн бүртгэлтэй эсэхийг шалгах
  const { data: existing } = await sb.from('profiles').select('id, role').eq('email', email).maybeSingle();

  let userId = existing?.id as string | undefined;

  if (userId) {
    console.log(`${email} аль хэдийн бүртгэлтэй байна — зөвхөн админ эрх олгоно.`);
  } else {
    const password = arg('password') || (await ask(`Нууц үг (доод тал нь ${MIN_PASSWORD} тэмдэгт): `, true));
    if (password.length < MIN_PASSWORD) {
      console.error(`Нууц үг хэт богино байна. Доод тал нь ${MIN_PASSWORD} тэмдэгт.`);
      process.exit(1);
    }

    const { data, error } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // имэйл баталгаажуулах алхмыг алгасна
      user_metadata: { name },
    });
    if (error) {
      console.error('Хэрэглэгч үүсгэхэд алдаа гарлаа:', error.message);
      process.exit(1);
    }
    userId = data.user.id;
    console.log(`Хэрэглэгч үүслээ: ${email}`);
  }

  // Профайлыг админ болгох (trigger-ээр үүссэн байх ёстой, эс бөгөөс оруулна)
  const { error: upsertError } = await sb
    .from('profiles')
    .upsert({ id: userId!, email, name, role: 'admin' }, { onConflict: 'id' });

  if (upsertError) {
    console.error('Админ эрх олгоход алдаа гарлаа:', upsertError.message);
    console.error('schema.sql-ийг ажиллуулсан эсэхээ шалгана уу.');
    process.exit(1);
  }

  console.log(`\nАдмин эрх олголоо: ${name} <${email}>`);
  console.log('Одоо /admin хаягаар нэвтэрнэ үү.\n');
}

main().catch((e) => {
  console.error('Алдаа:', e instanceof Error ? e.message : e);
  process.exit(1);
});
