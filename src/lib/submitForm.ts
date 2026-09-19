import type { SubmissionKind } from '../types';
import { getSupabase, isSupabaseConfigured, friendlyError } from './supabase';

/**
 * Сайтын маягтуудыг `submissions` хүснэгт рүү илгээнэ.
 *
 * Зочин нэвтрээгүй тул `anon` эрхээр бичнэ. Өгөгдлийн сангийн бодлого
 * (schema.sql -> "submissions: guest insert") зөвхөн INSERT зөвшөөрөх тул
 * энэ модуль бусдын илгээсэн хүсэлтийг уншиж чадахгүй — утасны дугаарууд
 * гадагш гарахгүй.
 *
 * Тэр бодлого доорх хязгаарыг шалгадаг. Хэтэрсэн утга ирвэл өгөгдлийн сан
 * татгалзах тул энд урьдчилж тайрна:
 *   phone        4–40 тэмдэгт
 *   contactName  120 хүртэл
 *   summary      300 хүртэл
 *   status       заавал 'new'
 */

const LIMITS = { phone: 40, contactName: 120, summary: 300 } as const;

/** Холбоо барих дугаар — илгээлт бүтэлгүйтвэл зочинд санал болгоно */
export const HOTLINE = '7723-2222';

export interface SubmitInput {
  contactName?: string;
  phone: string;
  summary: string;
  /** Маягтын бүрэн агуулга. Хоосон утгыг хасна. */
  details?: Record<string, string | number | boolean | undefined | null>;
  /**
   * Хавсаргасан зураг — data URL хэлбэрээр (`src/lib/photoAttach.ts`
   * шахсан байх ёстой). `details` дотор "Зураг 1", "Зураг 2" ... гэсэн
   * түлхүүрээр орох бөгөөд админы дэлгэц data: угтварыг таньж зураг
   * болгон харуулна.
   */
  photos?: string[];
}

/**
 * Төслийн tsconfig дээр `strict` асаагүй тул boolean литералаар төрөл
 * нарийсгах ажиллахгүй. Тиймээс ялгагчийг мөрөөр өгөв.
 */
export type SubmitResult =
  | { status: 'sent'; id: string }
  | { status: 'failed'; message: string };

/** Бүртгэлийн дугаар: SRV-260918-4821 */
function reference(kind: SubmissionKind): string {
  const prefix = {
    'service-ticket': 'SRV',
    emergency: 'SOS',
    booking: 'BKG',
    quote: 'QTE',
    sourcing: 'SRC',
    order: 'ORD',
  }[kind];

  const now = new Date();
  const date =
    String(now.getFullYear()).slice(2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');

  return `${prefix}-${date}-${Math.floor(1000 + Math.random() * 9000)}`;
}

/** Нэг хүсэлтэд хавсаргаж болох зургийн тоо (photoAttach.ts-тай ижил) */
const MAX_PHOTOS = 3;

/** Хоосон утгыг хасаж, бүгдийг мөр болгоно */
function cleanDetails(details: SubmitInput['details']): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(details ?? {})) {
    if (value === undefined || value === null || value === '') continue;
    out[key] = String(value).slice(0, 2000);
  }
  return out;
}

/** Зургуудыг details дотор нэр өгч байрлуулна. Зөвхөн зурган data URL нэвтэрнэ. */
function withPhotos(details: Record<string, string>, photos?: string[]): Record<string, string> {
  const valid = (photos ?? []).filter((p) => p.startsWith('data:image/')).slice(0, MAX_PHOTOS);
  valid.forEach((dataUrl, i) => {
    details[`Зураг ${i + 1}`] = dataUrl;
  });
  return details;
}

const clamp = (value: string, max: number) => value.trim().slice(0, max);

/**
 * Хүсэлтийг илгээнэ. Алдаа шидэхгүй — үргэлж үр дүнгээ буцаана,
 * ингэснээр дуудаж буй бүрэлдэхүүн try/catch бичих шаардлагагүй.
 */
export async function submitForm(kind: SubmissionKind, input: SubmitInput): Promise<SubmitResult> {
  const phone = clamp(input.phone ?? '', LIMITS.phone);

  if (phone.length < 4) {
    return { status: 'failed', message: 'Утасны дугаараа бүрэн оруулна уу.' };
  }

  if (!isSupabaseConfigured) {
    return {
      status: 'failed',
      message: `Хүсэлт илгээх сувгийг түр ашиглах боломжгүй байна. ${HOTLINE} дугаар луу залгана уу.`,
    };
  }

  const id = reference(kind);

  try {
    const sb = await getSupabase();
    const { error } = await sb.from('submissions').insert({
      id,
      kind,
      phone,
      contact_name: clamp(input.contactName ?? '', LIMITS.contactName),
      summary: clamp(input.summary ?? '', LIMITS.summary),
      status: 'new',
      details: withPhotos(cleanDetails(input.details), input.photos),
    });

    if (error) {
      return {
        status: 'failed',
        message: `${friendlyError(error)} ${HOTLINE} дугаар луу залгаж болно.`,
      };
    }

    return { status: 'sent', id };
  } catch (e) {
    return {
      status: 'failed',
      message: `${friendlyError(e)} ${HOTLINE} дугаар луу залгаж болно.`,
    };
  }
}
