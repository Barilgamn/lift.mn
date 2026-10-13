import type { Submission } from '../types';

/**
 * Сэлбэгийн үнийн санал.
 *
 * Каталогийн ихэнх бараа үнэгүй (0) ирдэг — үнэ нь ханш, захиалгын тоо,
 * хүргэлтээс хамаарч өөрчлөгддөг. Тэдгээр дээр "Үнэ тохиролцоно" гэхийн
 * оронд хэрэглэгч шууд үнийн санал хүсдэг болов.
 *
 * Хүсэлт нь `submissions` хүснэгтэд `kind = 'quote'` төрлөөр орно — шинэ
 * төрөл нэмбэл өгөгдлийн сангийн CHECK хязгаарлалтыг шинэчлэх шаардлагатай
 * бөгөөд шинэчлэхээс өмнө илгээсэн хүсэлт бүр алдаа өгнө. Оронд нь
 * `details`-ийн "Төрөл" талбараар лифтний үнийн саналаас ялгана.
 */

export const QUOTE_LABEL = 'Үнийн санал авах';

/** details["Төрөл"] — лифтний үнийн саналаас ялгах тэмдэг */
export const PRICE_QUOTE_TYPE = 'Сэлбэгийн үнийн санал';

/**
 * Хүнд харуулахгүй, программд хэрэгтэй талбарууд. Админы ерөнхий
 * дэлгэрэнгүй цонх `_`-ээр эхэлсэн түлхүүрийг нуудаг.
 */
export const Q = {
  productId: '_productId',
  variantId: '_variantId',
  /** Админы санал болгосон нэгжийн үнэ (₮) */
  price: '_quotedPrice',
  note: '_adminNote',
  at: '_quotedAt',
} as const;

export const isPriceQuote = (s: Submission): boolean =>
  s.kind === 'quote' && s.details?.['Төрөл'] === PRICE_QUOTE_TYPE;

/** Админы санал болгосон үнэ. Хараахан өгөөгүй бол null. */
export function quotedPrice(s: Submission): number | null {
  const n = Number(s.details?.[Q.price]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Ерөнхий дэлгэрэнгүйд харуулах эсэх — дотоод талбарыг нууна */
export const isPublicDetailKey = (key: string): boolean => !key.startsWith('_');
