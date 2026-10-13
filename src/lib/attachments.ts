/**
 * Маягтад хавсаргасан баримт бичиг (Word, PDF).
 *
 * Зургаас ялгаатай нь шахах боломжгүй тул data URL хэлбэрээр шууд
 * `submissions.details` дотор `Файл: <нэр>` түлхүүрээр хадгална.
 * Өгөгдлийн сангийн бодлого нийт `details`-ийг 2.5 сая тэмдэгтээр
 * хязгаарладаг (schema.sql) тул нэг файлын хэмжээг доор хязгаарлав.
 */

export const ATTACHMENT_PREFIX = 'Файл: ';

/** Зөвшөөрөгдсөн төрөл — input[accept] болон шалгалтад */
export const DOCUMENT_ACCEPT =
  '.doc,.docx,.pdf,application/pdf,application/msword,' +
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const ALLOWED_EXT = /\.(docx?|pdf)$/i;

/** 1.5 МБ — base64 болоход ~2 сая тэмдэгт, бодлогын хязгаарт багтана */
export const MAX_DOCUMENT_BYTES = 1.5 * 1024 * 1024;

export interface Attachment {
  name: string;
  dataUrl: string;
}

/** Файлыг шалгаад data URL болгоно. Буруу бол Монгол алдааны мессеж шиднэ. */
export function readDocument(file: File): Promise<Attachment> {
  if (!ALLOWED_EXT.test(file.name)) {
    return Promise.reject(new Error('Зөвхөн Word (.docx, .doc) эсвэл PDF файл хавсаргана уу.'));
  }
  if (file.size > MAX_DOCUMENT_BYTES) {
    return Promise.reject(new Error('Файл 1.5 МБ-аас их байна. Зураггүй хувилбарыг хавсаргана уу.'));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, dataUrl: String(reader.result) });
    reader.onerror = () => reject(new Error('Файлыг уншиж чадсангүй. Дахин оролдоно уу.'));
    reader.readAsDataURL(file);
  });
}

/** details-ийн мөр хавсаргасан баримт мөн эсэх (зураг биш data URL) */
export const isDocumentEntry = (value: unknown): boolean =>
  typeof value === 'string' && value.startsWith('data:') && !value.startsWith('data:image/');

/** `Файл: cs2.docx` → `cs2.docx` */
export const attachmentName = (key: string): string =>
  key.startsWith(ATTACHMENT_PREFIX) ? key.slice(ATTACHMENT_PREFIX.length) : key;

/**
 * Хавсралтыг татаж авна. data URL-ыг шууд холбоос болгон нээх нь
 * хөтчүүдэд хориотой тул Blob болгож татуулна.
 */
export async function downloadDataUrl(dataUrl: string, name: string): Promise<void> {
  const blob = await (await fetch(dataUrl)).blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
