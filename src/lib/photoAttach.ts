/**
 * Маягтад хавсаргах зургийг хөтөч дээр шахаж, data URL болгоно.
 *
 * Яагаад хөтөч дээр шахдаг вэ:
 *   Утасны камерын зураг 3-8 МБ байдаг. Тэднийг шууд илгээвэл өгөгдлийн
 *   сангийн мөр хэт томорч, админы жагсаалт удаашрана. Тиймээс урт талыг
 *   нь MAX_EDGE болгож багасгаад JPEG болгож шахна — ихэвчлэн 150-250 КБ
 *   болдог бөгөөд сэлбэгийн пайз, гэмтлийн байдал тодорхой харагдана.
 *
 * Зургийг тусдаа сан (Supabase Storage) руу биш, `submissions.details`
 * дотор data URL хэлбэрээр хадгална — нэмэлт тохиргоо шаардахгүй.
 */

/** Нэг хүсэлтэд хавсаргаж болох зургийн тоо */
export const MAX_PHOTOS = 3;

/** Шахсаны дараах зургийн урт талын дээд хэмжээ (пиксел) */
const MAX_EDGE = 1280;

/** Шахсаны дараа хүлээн зөвшөөрөх дээд хэмжээ */
const MAX_BYTES = 400 * 1024;

/** Эх файлын дээд хэмжээ — үүнээс дээш бол уншихаас нь өмнө татгалзана */
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

/** JPEG чанарыг буурааж, хэмжээнд багтах хүртэл оролдоно */
const QUALITY_STEPS = [0.72, 0.6, 0.48, 0.38];

export type AttachResult =
  | { status: 'ok'; dataUrl: string; bytes: number }
  | { status: 'failed'; message: string };

/** data URL-ийн ойролцоо байт хэмжээ */
function approxBytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  return Math.floor((base64.length * 3) / 4);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Зургийг нээж чадсангүй'));
    };
    img.src = url;
  });
}

/**
 * Файлыг шахаж data URL болгоно. Алдаа шидэхгүй — үр дүнгээ буцаана.
 */
export async function attachPhoto(file: File): Promise<AttachResult> {
  if (!file.type.startsWith('image/')) {
    return { status: 'failed', message: `"${file.name}" — зураг биш байна.` };
  }
  if (file.size > MAX_SOURCE_BYTES) {
    return { status: 'failed', message: `"${file.name}" хэт том байна (25 МБ-аас бага байх ёстой).` };
  }

  try {
    const img = await loadImage(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return { status: 'failed', message: 'Энэ хөтөч дээр зураг боловсруулж чадсангүй.' };

    // Ил тод хэсэгтэй зураг (PNG) JPEG болоход хар болдог тул цагаан дэвсгэр тавина
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    for (const quality of QUALITY_STEPS) {
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const bytes = approxBytes(dataUrl);
      if (bytes <= MAX_BYTES) return { status: 'ok', dataUrl, bytes };
    }

    return {
      status: 'failed',
      message: `"${file.name}" хэт нарийвчлалтай байна. Өөр зураг сонгоно уу.`,
    };
  } catch (e) {
    return {
      status: 'failed',
      message: e instanceof Error ? e.message : 'Зургийг уншиж чадсангүй.',
    };
  }
}

/** Хүн уншихад ойлгомжтой хэмжээ: "184 КБ" */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}
