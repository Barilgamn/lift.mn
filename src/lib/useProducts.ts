import { useEffect, useState } from 'react';
import { SparePart } from '../types';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { rowToProduct } from './mappers';
import { SPARE_PARTS } from '../data/mockData';

/**
 * Дэлгүүрийн бүтээгдэхүүн.
 *
 * Supabase тохируулагдсан бол ЗӨВХӨН тэндээс уншина — админ дээр хийсэн
 * өөрчлөлт (үнэ, нөөц, зураг) сайт дээр шууд харагдана. Админ бүх барааг
 * устгасан бол дэлгүүр хоосон харагдана; файл дахь жишээ өгөгдөл
 * эргэж гарч ирэхгүй. Эс бөгөөс админ хоосон, үйлчлүүлэгч дүүрэн гэсэн
 * зөрүү үүснэ.
 *
 * Жишээ өгөгдөл рүү зөвхөн хоёр тохиолдолд шилжинэ:
 *   - Supabase огт тохируулаагүй (.env бөглөгдөөгүй)
 *   - Уншилт алдаа өглөө (сүлжээ, эрх) — дэлгүүр хоосон харагдвал
 *     хүн юу ч болсныг мэдэхгүй тул байгаа каталогоо харуулна
 *
 * Сүлжээ тасарсан үед supabase-js 10 гаруй секунд дахин оролддог. Тэр
 * хугацаанд дэлгүүр хоосон зогсохоос сэргийлж хүсэлтийг таслана.
 */

/** Хэдэн секунд хүлээгээд жишээ каталог руу шилжих вэ */
const TIMEOUT_MS = 6000;
export function useProducts(): { products: SparePart[]; loading: boolean } {
  // Supabase-тэй үед ачаалал дуустал хоосон — жишээ бараа анивчихгүй
  const [products, setProducts] = useState<SparePart[]>(
    isSupabaseConfigured ? [] : SPARE_PARTS
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let alive = true;

    void getSupabase()
      .then((sb) =>
        sb.from('products').select('*').order('name').abortSignal(AbortSignal.timeout(TIMEOUT_MS))
      )
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) {
          console.error('Бүтээгдэхүүн уншиж чадсангүй:', error.message);
          setProducts(SPARE_PARTS);
        } else {
          // data нь хоосон массив байж БОЛНО — тэр нь бодит хариу
          setProducts((data ?? []).map(rowToProduct));
        }
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        console.error('Бүтээгдэхүүн уншиж чадсангүй:', e);
        setProducts(SPARE_PARTS);
        setLoading(false);
      });

    return () => { alive = false; };
  }, []);

  return { products, loading };
}
