import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { thumbUrl } from '../lib/productImages';

interface ProductImageProps {
  src?: string;
  alt: string;
  /** Зураг болон орлуулагч хоёуланд нь өгөх ангилал */
  className?: string;
  /** Орлуулагчийн дэвсгэр — цайвар, бараан хэсэгт өөр байна */
  fallbackClassName?: string;
  iconClassName?: string;
  loading?: 'lazy' | 'eager';
  /** Жижиг харагдах газарт сангийн жижиг хувилбарыг (`-sm`) ачаална */
  thumb?: boolean;
}

/**
 * Эвдэрсэн зургийг хөтчийн "тасарсан зураг" тэмдгээр биш, цэвэрхэн
 * орлуулагчаар харуулна.
 *
 * Бүтээгдэхүүний зураг нь гадны холбоос (жишээ нь хуучин жишээ өгөгдлийн
 * Unsplash линк), админы оруулсан хаяг, эсвэл төслийн файл байж болно.
 * Аль нь ч ачаалагдахгүй байж магадгүй тул нэг дор барина.
 */
export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  fallbackClassName = 'bg-surface-3',
  iconClassName = 'w-6 h-6 opacity-40',
  loading = 'lazy',
  thumb = false,
}) => {
  // 0 — үндсэн (эсвэл жижиг) хувилбар, 1 — жижиг нь алга бол бүтэн зураг, 2 — бүтэлгүй
  const [stage, setStage] = useState(0);
  const [prevSrc, setPrevSrc] = useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setStage(0);
  }
  const small = thumb ? thumbUrl(src) : src;
  const current = stage === 0 ? small : src;

  if (!src || stage === 2) {
    return (
      <div
        role="img"
        aria-label={`${alt} — зураг алга`}
        className={`${className} ${fallbackClassName} flex items-center justify-center`}
      >
        <ImageOff className={iconClassName} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={current}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setStage(stage === 0 && small !== src ? 1 : 2)}
      className={className}
    />
  );
};
