import React from 'react';

interface DeltaLiftsLogoProps {
  /**
   * 'color' / 'official': Authentic uploaded logo — Blue blades (#0063A5), yellow center (#F9A01B), blue DELTA LIFTS text (#0063A5)
   * 'dark': White text and white blades with yellow center (for high contrast on dark surfaces)
   * 'white': All white mark & text
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
 * Mathematically precise vector mark of the official DELTA LIFTS logo:
 * 3-blade cyclic delta triskelion in corporate blue (#0063A5)
 * with an equilateral golden-yellow (#F9A01B) triangle at the center,
 * exactly matching the user's uploaded official brand asset.
 */
export const DeltaLiftsMark: React.FC<{
  className?: string;
  bladeColor?: string;
  blueColor?: string; // backwards compatibility alias
  yellowColor?: string;
}> = ({
  className = 'w-10 h-10',
  bladeColor,
  blueColor,
  yellowColor = '#F9A01B'
}) => {
  // Default to corporate blue (#0063A5) as seen in the official asset
  const resolvedBladeColor = bladeColor || blueColor || '#0063A5';

  return (
    <svg
      viewBox="0 0 200 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DELTA LIFTS Mark"
    >
      {/* Central Golden-Yellow Equilateral Triangle */}
      <polygon
        points="100,75 126.8,121 73.2,121"
        fill={yellowColor}
      />
      {/* Blade 1: Top Apex & Left Edge */}
      <polygon
        points="100,10 113.8,34 102.3,71 74.5,119 33.5,125"
        fill={resolvedBladeColor}
      />
      {/* Blade 2: Bottom-Right Corner & Right Edge */}
      <polygon
        points="182.3,152.5 154.6,152.5 128.3,124 100.6,75.9 115.9,37.4"
        fill={resolvedBladeColor}
      />
      {/* Blade 3: Bottom-Left Corner & Bottom Edge */}
      <polygon
        points="17.7,152.5 31.6,128.5 69.4,120 124.9,120.1 150.6,152.6"
        fill={resolvedBladeColor}
      />
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
    sm: { icon: 'w-7 h-6', text: 'text-sm sm:text-base', gap: 'gap-2.5', tracking: 'tracking-wide' },
    md: { icon: 'w-9 h-8', text: 'text-lg sm:text-xl', gap: 'gap-3', tracking: 'tracking-wide' },
    lg: { icon: 'w-12 h-10', text: 'text-xl md:text-2xl', gap: 'gap-3.5', tracking: 'tracking-wide' },
    xl: { icon: 'w-20 h-17 md:w-24 md:h-20', text: 'text-2xl sm:text-3xl md:text-4xl', gap: 'gap-4', tracking: 'tracking-wider' },
    custom: { icon: '', text: '', gap: 'gap-2', tracking: 'tracking-wide' }
  };

  const selectedSize = sizeMap[size];

  const isColor = variant === 'color' || variant === 'official';
  const textColorClass = isColor
    ? 'text-[#0063A5]'
    : 'text-white';

  const bladeColor = isColor ? '#0063A5' : '#FFFFFF';
  const yellowColor = '#F9A01B';

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${selectedSize.gap} ${className}`}>
        <DeltaLiftsMark
          className={`${selectedSize.icon} ${iconClassName} shrink-0 drop-shadow-md`}
          bladeColor={bladeColor}
          yellowColor={yellowColor}
        />
        {showText && (
          <div className={`font-black font-['Michroma',sans-serif] uppercase ${textColorClass} ${selectedSize.text} ${selectedSize.tracking} ${textClassName}`}>
            DELTA LIFTS
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${selectedSize.gap} select-none ${className}`}>
      <DeltaLiftsMark
        className={`${selectedSize.icon} ${iconClassName} shrink-0 drop-shadow-md`}
        bladeColor={bladeColor}
        yellowColor={yellowColor}
      />
      {showText && (
        <div className={`font-black font-['Michroma',sans-serif] uppercase ${textColorClass} ${selectedSize.text} ${selectedSize.tracking} ${textClassName}`}>
          DELTA LIFTS
        </div>
      )}
    </div>
  );
};

export default DeltaLiftsLogo;
