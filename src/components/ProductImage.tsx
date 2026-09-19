import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  /** Зураг болон орлуулагч хоёуланд нь өгөх ангилал */
  className?: string;
  /** Орлуулагчийн дэвсгэр — цайвар, бараан хэсэгт өөр байна */
  fallbackClassName?: string;
  iconClassName?: string;
  loading?: 'lazy' | 'eager';
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
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
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
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
