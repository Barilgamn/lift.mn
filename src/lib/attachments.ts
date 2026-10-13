import { getSupabase } from './supabase';

/**
 * Маягтад хавсаргасан баримт бичиг (Word, PDF).
 *
 * Хоёр аргаар хадгална:
 *   1. Supabase Storage (`storage:<bucket>/<зам>`) — үндсэн арга. Тоглогчдын
 *      зурагтай мэдүүлэг 5–20 МБ болдог тул баазад багтахгүй.
 *      supabase/schema.sql-ийн "storage" хэсгийг ажиллуулсан байх ёстой.
 *   2. data URL — Storage бэлэн биш үед 1.5 МБ хүртэлх файлыг шууд
 *      `submissions.details` дотор хадгална (бодлогын 2.5 сая тэмдэгтэд багтана).
 *
 * Аль ч тохиолдолд `details` дотор `Файл: <нэр>` түлхүүрээр орно.
 */

export const ATTACHMENT_PREFIX = 'Файл: ';
export const STORAGE_PREFIX = 'storage:';

/** Зөвшөөрөгдсөн төрөл — input[accept] болон шалгалтад */
export const DOCUMENT_ACCEPT =
  '.doc,.docx,.pdf,application/pdf,application/msword,' +
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const extOf = (name: string) => (name.match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toLowerCase();

/** Storage-ийн дээд хэмжээ (bucket-ийн file_size_limit-тэй ижил) */
export const MAX_STORAGE_BYTES = 20 * 1024 * 1024;
/** Баазад шууд хадгалах дээд хэмжээ — base64 болоход ~2 сая тэмдэгт */
export const MAX_INLINE_BYTES = 1.5 * 1024 * 1024;

export interface Attachment {
  name: string;
  /** `data:...` эсвэл `storage:<bucket>/<зам>` */
  value: string;
}

/** Файлын төрөл, хэмжээг шалгана. Буруу бол Монгол мессеж буцаана. */
export function checkDocument(file: File, maxBytes = MAX_STORAGE_BYTES): string | null {
  if (!MIME_BY_EXT[extOf(file.name)]) return 'Зөвхөн Word (.docx, .doc) эсвэл PDF файл хавсаргана уу.';
  if (file.size > maxBytes) return `"${file.name}" ${Math.round(maxBytes / 1024 / 1024)} МБ-аас их байна.`;
  return null;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Файлыг уншиж чадсангүй. Дахин оролдоно уу.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Баримтыг хадгална: эхлээд Storage, бүтэлгүйтвэл жижиг файлыг data URL болгоно.
 * Хадгалж чадахгүй бол Монгол мессежтэй алдаа шиднэ.
 */
export async function storeDocument(file: File, bucket: string, fallbackEmail: string): Promise<Attachment> {
  const problem = checkDocument(file);
  if (problem) throw new Error(problem);

  const ext = extOf(file.name);
  const safe = file.name.replace(/[^\w.-]+/g, '_').slice(-80);
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safe}`;
  try {
    const sb = await getSupabase();
    // supabase-js нь File-ийг multipart-аар илгээхдээ contentType-ийг үл тоож
    // файлын өөрийн төрлийг ашигладаг. Зарим систем .docx-ийн төрлийг хоосон
    // өгдөг тул сангийн allowed_mime_types татгалзана — зөв төрлөөр дахин боов.
    const typed = new File([file], file.name, { type: MIME_BY_EXT[ext] });
    const { error } = await sb.storage
      .from(bucket)
      .upload(path, typed, { contentType: MIME_BY_EXT[ext], upsert: false });
    if (!error) return { name: file.name, value: `${STORAGE_PREFIX}${bucket}/${path}` };
    console.warn('Storage руу хадгалж чадсангүй:', error.message);
  } catch (e) {
    console.warn('Storage руу хадгалж чадсангүй:', e);
  }

  if (file.size <= MAX_INLINE_BYTES) return { name: file.name, value: await readAsDataUrl(file) };
  throw new Error(
    `"${file.name}" файлыг хадгалж чадсангүй. Мэдүүлгээ ${fallbackEmail} хаяг руу имэйлээр илгээнэ үү.`
  );
}

/** details-ийн мөр хавсаргасан баримт мөн эсэх (зураг биш data URL, эсвэл Storage) */
export const isDocumentEntry = (value: unknown): boolean =>
  typeof value === 'string' &&
  (value.startsWith(STORAGE_PREFIX) || (value.startsWith('data:') && !value.startsWith('data:image/')));

/** `Файл: cs2.docx` → `cs2.docx` */
export const attachmentName = (key: string): string =>
  key.startsWith(ATTACHMENT_PREFIX) ? key.slice(ATTACHMENT_PREFIX.length) : key;

function clickDownload(href: string, name: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Хавсралтыг татаж авна (админ).
 *   - Storage: нэвтэрсэн админд 1 минутын түр холбоос үүсгэнэ (bucket хувийн).
 *   - data URL: шууд холбоос болгох нь хөтчүүдэд хориотой тул Blob болгоно.
 */
export async function downloadAttachment(value: string, name: string): Promise<void> {
  if (value.startsWith(STORAGE_PREFIX)) {
    const ref = value.slice(STORAGE_PREFIX.length);
    const bucket = ref.slice(0, ref.indexOf('/'));
    const path = ref.slice(bucket.length + 1);
    const sb = await getSupabase();
    const { data, error } = await sb.storage.from(bucket).createSignedUrl(path, 60, { download: name });
    if (error || !data?.signedUrl) {
      window.alert(`Файлыг татаж чадсангүй: ${error?.message ?? 'холбоос үүссэнгүй'}`);
      return;
    }
    clickDownload(data.signedUrl, name);
    return;
  }
  const blob = await (await fetch(value)).blob();
  const url = URL.createObjectURL(blob);
  clickDownload(url, name);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
