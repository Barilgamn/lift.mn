import { useEffect, useState } from 'react';
import { SparePart } from '../types';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { rowToProduct } from './mappers';
import { SPARE_PARTS } from '../data/mockData';

/**
 * Дэлгүүрийн бүтээгдэхүүн.
 *
 * Supabase тохируулагдсан бол тэндээс уншина — ингэснээр админ дээр
 * хийсэн өөрчлөлт (үнэ, нөөц, зураг) сайт дээр шууд харагдана.
 * Тохируулагдаагүй бол файл дахь жишээ өгөгдлийг харуулж, сайт
 * ямар ч тохиолдолд ажиллана.
 */
export function useProducts(): { products: SparePart[]; loading: boolean } {
  const [products, setProducts] = useState<SparePart[]>(SPARE_PARTS);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let alive = true;

    void getSupabase()
      .then((sb) => sb.from('products').select('*').order('name'))
      .then(({ data, error }) => {
        if (!alive) return;
        // Алдаа гарвал жишээ өгөгдөл дээрээ үлдэнэ — дэлгүүр хоосон харагдахгүй
        if (!error && data?.length) setProducts(data.map(rowToProduct));
        setLoading(false);
      })
      .catch(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, []);

  return { products, loading };
}
