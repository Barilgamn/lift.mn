import React from 'react';

/** Корпорацийн цэнхэр — DELTA LIFTS брэндийн үндсэн өнгө */
export const DELTA_BLUE = '#0063A5';
/** Тэмдгийн төв дэх алтлаг шар */
export const DELTA_YELLOW = '#F9A01B';

interface DeltaLiftsLogoProps {
  /**
   * 'color' / 'official': Цэнхэр тэмдэг, цэнхэр бичиг — цайвар дэвсгэрт
   * 'dark' / 'white': Цагаан тэмдэг, цагаан бичиг — бараан дэвсгэрт
   */
  variant?: 'color' | 'official' | 'dark' | 'white';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  layout?: 'horizontal' | 'stacked';
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

/**
 * DELTA LIFTS-ийн албан ёсны тэмдэг.
 *
 * Оройгоос доош чиглэсэн нэг бүтэн гурвалжин: зүүн талд нимгэн зүү, түүнээс
 * зайгаар тусгаарлагдсан үндсэн бие. Доод ирмэг нь дотогшоо нумарч баруун доод
 * буланд хурц үзүүр үүсгэнэ. Төвд нь дээшээ харсан шар гурвалжин байрлана.
 */
export const DeltaLiftsMark: React.FC<{
  className?: string;
  bladeColor?: string;
  blueColor?: string; // хуучин нэршлийн нийцэл
  yellowColor?: string;
}> = ({
  className = 'w-10 h-10',
  bladeColor,
  blueColor,
  yellowColor = DELTA_YELLOW
}) => {
  const resolvedBladeColor = bladeColor || blueColor || DELTA_BLUE;

  return (
    <svg
      viewBox="0 0 200 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="DELTA LIFTS"
    >
      {/* Зүүн нимгэн зүү */}
      <path d="M94,16 L10,150 L44,138 Z" fill={resolvedBladeColor} />
      {/* Үндсэн бие — нумарсан доод ирмэгтэй */}
      <path d="M100,16 L194,148 Q118,120 52,139 Z" fill={resolvedBladeColor} />
      {/* Төвийн шар гурвалжин */}
      <polygon points="100,54 118,90 82,90" fill={yellowColor} />
    </svg>
  );
};

export const DeltaLiftsLogo: React.FC<DeltaLiftsLogoProps> = ({
  variant = 'official',
  showText = true,
  size = 'md',
  layout = 'horizontal',
  className = '',
  iconClassName = '',
  textClassName = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-7', text: 'text-sm sm:text-base', gap: 'gap-2.5' },
    md: { icon: 'w-10 h-9', text: 'text-lg sm:text-xl', gap: 'gap-3' },
    lg: { icon: 'w-12 h-11', text: 'text-xl md:text-2xl', gap: 'gap-3.5' },
    xl: { icon: 'w-20 h-17 md:w-24 md:h-20', text: 'text-2xl sm:text-3xl md:text-4xl', gap: 'gap-4' },
    custom: { icon: '', text: '', gap: 'gap-2' }
  };

  const selectedSize = sizeMap[size];

  const isColor = variant === 'color' || variant === 'official';
  const textColorClass = isColor ? 'text-[#0063A5]' : 'text-white';
  const bladeColor = isColor ? DELTA_BLUE : '#FFFFFF';

  const wordmark = showText && (
    <div
      className={`font-['Inter',sans-serif] font-black uppercase tracking-tight ${textColorClass} ${selectedSize.text} ${textClassName}`}
    >
      DELTA LIFTS
    </div>
  );

  const mark = (
    <DeltaLiftsMark
      className={`${selectedSize.icon} ${iconClassName} shrink-0`}
      bladeColor={bladeColor}
      yellowColor={DELTA_YELLOW}
    />
  );

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${selectedSize.gap} ${className}`}>
        {mark}
        {wordmark}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${selectedSize.gap} select-none ${className}`}>
      {mark}
      {wordmark}
    </div>
  );
};

export default DeltaLiftsLogo;
