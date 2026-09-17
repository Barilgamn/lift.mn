import React from 'react';

/**
 * DELTA LIFTS-ийн албан ёсны лого.
 *
 * Брэндийн эх файл `public/logo.webp` (2431x454, тунгалаг дэвсгэртэй).
 * Зөвхөн тэмдэг болон зөвхөн бичиг хэрэгтэй тохиолдолд түүнээс таслаж авсан
 * хувилбарыг ашиглана. Гурвуулаа нэг эх зурагнаас гарсан тул хэлбэр, өнгө нь
 * брэндийн эх хувилбартай яг тохирно.
 */
const LOCKUP_SRC = '/logo.webp';            // тэмдэг + DELTA LIFTS бичиг
const MARK_SRC = '/logo-mark.webp';         // зөвхөн гурвалжин тэмдэг
const WORDMARK_SRC = '/logo-wordmark.webp'; // зөвхөн DELTA LIFTS бичиг

/** Корпорацийн цэнхэр — логоны үндсэн өнгө */
export const DELTA_BLUE = '#0063A5';
/** Тэмдгийн төв дэх алтлаг шар */
export const DELTA_YELLOW = '#F9A01B';

interface DeltaLiftsLogoProps {
  /**
   * Лого нь эх зураг тул өнгө тогтмол. Энэ проп хуучин дуудлагуудтай
   * нийцүүлэхийн тулд үлдсэн бөгөөд харагдацад нөлөөлөхгүй.
   */
  variant?: 'color' | 'official' | 'dark' | 'white';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  layout?: 'horizontal' | 'stacked';
  className?: string;
  iconClassName?: string;
  /** Бичиг нь эх зурагны нэг хэсэг тул өнгө солих класс үйлчлэхгүй. */
  textClassName?: string;
}

/**
 * Зөвхөн гурвалжин тэмдэг.
 *
 * Өнгөний пропууд (bladeColor, yellowColor) хуучин дуудлагуудтай нийцүүлэхийн
 * тулд хэвээр үлдсэн — эх зураг учраас өнгө нь тогтмол.
 */
export const DeltaLiftsMark: React.FC<{
  className?: string;
  bladeColor?: string;
  blueColor?: string;
  yellowColor?: string;
}> = ({ className = 'h-10 w-auto' }) => (
  <img
    src={MARK_SRC}
    alt="DELTA LIFTS"
    className={`object-contain select-none ${className}`}
    draggable={false}
  />
);

export const DeltaLiftsLogo: React.FC<DeltaLiftsLogoProps> = ({
  showText = true,
  size = 'md',
  layout = 'horizontal',
  className = '',
  iconClassName = ''
}) => {
  // Өндрөөр удирдаж, өргөнийг зурагны харьцаагаар тооцуулна
  const heightMap = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 md:h-20 w-auto',
    custom: ''
  };

  const sizeClass = heightMap[size];

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 select-none ${className}`}>
        <img
          src={MARK_SRC}
          alt="DELTA LIFTS"
          className={`object-contain ${sizeClass} ${iconClassName}`}
          draggable={false}
        />
        {showText && (
          <img
            src={WORDMARK_SRC}
            alt=""
            aria-hidden="true"
            className="w-full max-w-40 object-contain"
            draggable={false}
          />
        )}
      </div>
    );
  }

  // Хэвтээ байрлалд бүтэн логог нэг зургаар — тэмдэг, бичиг хоёрын хоорондох
  // зай болон харьцаа нь брэндийн эх файлынхаараа хэвээр хадгалагдана
  return (
    <img
      src={showText ? LOCKUP_SRC : MARK_SRC}
      alt="DELTA LIFTS"
      className={`object-contain select-none ${sizeClass} ${iconClassName} ${className}`}
      draggable={false}
    />
  );
};

export default DeltaLiftsLogo;
