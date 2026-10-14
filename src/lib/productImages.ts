import { getSupabase } from './supabase';

/**
 * Бүтээгдэхүүний зураг — Supabase Storage-ийн нийтийн `products` сан.
 *
 * Өмнө нь зургийг 200 КБ хүртэл жижигрүүлж `products.image` баганад data URL
 * болгон хадгалдаг байсан тул бүдэг харагдаж, дэлгүүр нээх бүрт бүх зураг
 * мэдээллийн сангаас татагддаг байв. Одоо:
 *
 *   - Админ ямар ч хэмжээтэй (утасны камерын) зураг сонгоход хөтөч дээр
 *     урт талыг нь FULL_EDGE болгож, өндөр чанартай WebP (эсвэл JPEG) болгоно.
 *   - Жагсаалт, жижиг дүрсэд зориулж THUMB_EDGE хэмжээтэй хувилбар
 *     (`<нэр>-sm.webp`) зэрэг хадгална — дэлгүүрийн хуудас хурдан ачаална.
 *   - Баганад зөвхөн нийтийн холбоос (URL) орно.
 *
 * Сан бэлэн биш (supabase/products-storage.sql ажиллуулаагүй) бол хуучин
 * аргаар — шахсан data URL — хадгална.
 */

export const PRODUCT_BUCKET = 'products';

/** Дэлгэрэнгүй хуудас, томруулж харахад — retina дэлгэцэд ч тод */
const FULL_EDGE = 1600;
/** Карт, загварын жижиг дүрс */
const THUMB_EDGE = 640;
const FULL_QUALITY = 0.86;
const THUMB_QUALITY = 0.8;

/** Сан бэлэн биш үед баазад хадгалах дээд хэмжээ */
const FALLBACK_EDGE = 1200;
const FALLBACK_MAX_BYTES = 450 * 1024;

/** Эх файлын дээд хэмжээ */
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;

const THUMB_SUFFIX = '-sm';

export type ProductImageResult =
  | { status: 'ok'; url: string; bytes: number; stored: 'storage' | 'inline' }
  | { status: 'failed'; message: string };

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
      reject(new Error(`"${file.name}" зургийг нээж чадсангүй.`));
    };
    img.src = url;
  });
}

/** Зургийг урт тал нь `edge`-ээс хэтрэхгүйгээр зурна (томруулахгүй) */
function drawScaled(img: HTMLImageElement, edge: number): HTMLCanvasElement {
  const scale = Math.min(1, edge / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Энэ хөтөч дээр зураг боловсруулж чадсангүй.');
  // Ил тод PNG-ийн дэвсгэр картын цагаантай ижил байг
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** WebP-г дэмждэггүй хөтөч (хуучин Safari) PNG буцаадаг тул JPEG руу шилжинэ */
async function encode(canvas: HTMLCanvasElement, quality: number): Promise<{ blob: Blob; ext: string }> {
  const webp = await toBlob(canvas, 'image/webp', quality);
  if (webp && webp.type === 'image/webp') return { blob: webp, ext: 'webp' };
  const jpeg = await toBlob(canvas, 'image/jpeg', quality);
  if (!jpeg) throw new Error('Зургийг хөрвүүлж чадсангүй.');
  return { blob: jpeg, ext: 'jpg' };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Зургийг уншиж чадсангүй.'));
    reader.readAsDataURL(blob);
  });
}

/** Сан бэлэн биш үед — баазад багтах хэмжээтэй data URL */
async function inlineFallback(img: HTMLImageElement): Promise<ProductImageResult> {
  const canvas = drawScaled(img, FALLBACK_EDGE);
  for (const q of [0.82, 0.72, 0.6, 0.5]) {
    const { blob } = await encode(canvas, q);
    if (blob.size <= FALLBACK_MAX_BYTES) {
      return { status: 'ok', url: await blobToDataUrl(blob), bytes: blob.size, stored: 'inline' };
    }
  }
  return { status: 'failed', message: 'Зураг хэт нарийвчлалтай байна. Өөр зураг сонгоно уу.' };
}

/**
 * Админы сонгосон зургийг боловсруулж хадгална. Алдаа шидэхгүй —
 * үр дүнгээ буцаана.
 */
export async function uploadProductImage(file: File): Promise<ProductImageResult> {
  if (!file.type.startsWith('image/')) {
    return { status: 'failed', message: `"${file.name}" — зураг биш байна.` };
  }
  if (file.size > MAX_SOURCE_BYTES) {
    return { status: 'failed', message: `"${file.name}" хэт том байна (30 МБ-аас бага байх ёстой).` };
  }

  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch (e) {
    return { status: 'failed', message: e instanceof Error ? e.message : 'Зургийг уншиж чадсангүй.' };
  }

  try {
    const full = await encode(drawScaled(img, FULL_EDGE), FULL_QUALITY);
    const thumb = await encode(drawScaled(img, THUMB_EDGE), THUMB_QUALITY);
    const base = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}`;
    const fullPath = `${base}.${full.ext}`;
    const thumbPath = `${base}${THUMB_SUFFIX}.${thumb.ext}`;

    const sb = await getSupabase();
    const bucket = sb.storage.from(PRODUCT_BUCKET);
    const opts = (blob: Blob) => ({ contentType: blob.type, cacheControl: '31536000', upsert: false });
    const up1 = await bucket.upload(fullPath, full.blob, opts(full.blob));
    if (up1.error) throw up1.error;
    const up2 = await bucket.upload(thumbPath, thumb.blob, opts(thumb.blob));
    if (up2.error) {
      // Жижиг хувилбаргүй бол бүтэн зураг руу буцна (thumbUrl-ийн onError)
      console.warn('Жижиг зургийг хадгалж чадсангүй:', up2.error.message);
    }
    const url = bucket.getPublicUrl(fullPath).data.publicUrl;
    return { status: 'ok', url, bytes: full.blob.size, stored: 'storage' };
  } catch (e) {
    console.warn('Storage руу хадгалж чадсангүй, баазад хадгална:', e);
    try {
      return await inlineFallback(img);
    } catch (err) {
      return { status: 'failed', message: err instanceof Error ? err.message : 'Зургийг хадгалж чадсангүй.' };
    }
  }
}

const STORAGE_MARK = `/storage/v1/object/public/${PRODUCT_BUCKET}/`;

/** Зураг манай `products` санд байгаа эсэх */
export const isStoredProductImage = (url?: string): boolean => !!url && url.includes(STORAGE_MARK);

/**
 * Карт, жижиг дүрсэд — сангийн зургийн жижиг хувилбар. Бусад (гадны
 * холбоос, data URL, төслийн файл) зургийг өөрчлөхгүй.
 */
export function thumbUrl(url?: string): string | undefined {
  if (!url || !isStoredProductImage(url)) return url;
  return url.replace(/(\.[a-z0-9]+)(\?.*)?$/i, `${THUMB_SUFFIX}$1$2`);
}

/** Сангийн зургийн зам (бүтэн + жижиг) — бараа устгахад */
export function storedImagePaths(urls: (string | undefined)[]): string[] {
  const out: string[] = [];
  for (const url of urls) {
    if (!isStoredProductImage(url)) continue;
    const path = decodeURIComponent(url!.slice(url!.indexOf(STORAGE_MARK) + STORAGE_MARK.length).split('?')[0]);
    out.push(path, path.replace(/(\.[a-z0-9]+)$/i, `${THUMB_SUFFIX}$1`));
  }
  return out;
}
