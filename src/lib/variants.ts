import type { ProductVariant, SparePart } from '../types';
import { QUOTE_LABEL } from './priceQuote';

/**
 * Хувилбарыг сагсанд нэмэхэд бэлтгэх.
 *
 * Сагс нь `CartItem { part, quantity }` бүтэцтэй бөгөөд барааг `part.id`-ээр
 * ялгадаг. Хувилбар бүрийг тусад нь тоолуулахын тулд эцэг бараанаас
 * `эцэг::хувилбар` гэсэн нийлмэл дугаартай хуулбар үүсгэнэ. Ингэснээр
 * сагсны нэмэх, хасах, тоо өөрчлөх логикийг хөндөх шаардлагагүй.
 */
export function variantAsPart(parent: SparePart, variant: ProductVariant): SparePart {
  return {
    ...parent,
    id: `${parent.id}::${variant.id}`,
    name: `${parent.name} — ${variant.code}`,
    oemCode: variant.code,
    brand: variant.brand || parent.brand,
    price: variant.price,
    stockCount: variant.stockCount,
    inStock: variant.stockCount > 0,
    image: variant.image || parent.image,
    variants: [],
    specs: { ...parent.specs, 'Загвар': variant.code, 'Тайлбар': variant.name },
  };
}

/** Хувилбаруудын үнийн хязгаар. Бүгд 0 бол null. */
export function priceRange(variants?: ProductVariant[]): { min: number; max: number } | null {
  const prices = (variants ?? []).map((v) => v.price).filter((p) => p > 0);
  if (!prices.length) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Үнийг харуулах бичиг. 0 бол үнийн санал авах товч гарна. */
export function priceLabel(price: number): string {
  return price > 0 ? `${price.toLocaleString()} ₮` : QUOTE_LABEL;
}

/** Үнэ тавигдсан эсэх — үгүй бол "Үнийн санал авах" товч харуулна */
export function hasPrice(part: SparePart): boolean {
  return part.variants?.length ? priceRange(part.variants) !== null : part.price > 0;
}

/** Карт дээр харуулах үнийн бичиг — хувилбартай бол хязгаараар */
export function productPriceLabel(part: SparePart): string {
  if (part.variants?.length) {
    const r = priceRange(part.variants);
    if (!r) return QUOTE_LABEL;
    return r.min === r.max
      ? priceLabel(r.min)
      : `${r.min.toLocaleString()} – ${r.max.toLocaleString()} ₮`;
  }
  return priceLabel(part.price);
}
