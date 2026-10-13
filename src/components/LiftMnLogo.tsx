import React from 'react';
import { SHOW_BETA } from '../config';

const BETA_SIZE = {
  sm: 'text-[8px] sm:text-[9px] px-1.5 py-[3px]',
  lg: 'text-[9px] sm:text-[11px] px-2 py-1',
} as const;

/**
 * LIFT.MN-ийн лого.
 *
 * Эх файл нь JPG байсныг вектор болгож (public/lift-mn.svg) хөх, шар хоёр
 * давхаргатайгаар зурав — ямар ч хэмжээнд хурц, дэвсгэр нь тунгалаг.
 * Өндрийг нь `className`-аар өгнө, өргөн нь харьцаагаараа тохирно.
 *
 * `beta` өгвөл логоны ард "BETA" тэмдэг гарна (config.ts-ийн SHOW_BETA-аар
 * нэг дор унтраана).
 */
export const LiftMnLogo: React.FC<{ className?: string; beta?: keyof typeof BETA_SIZE }> = ({
  className = 'h-8',
  beta,
}) => {
  const img = (
    <img
      src="/lift-mn.svg"
      alt="LIFT.MN"
      width={639}
      height={127}
      className={`w-auto select-none ${className}`}
      draggable={false}
    />
  );
  if (!beta || !SHOW_BETA) return img;
  return (
    <span className="inline-flex items-start gap-1.5 sm:gap-2 shrink-0">
      {img}
      <span
        data-beta-badge
        className={`${BETA_SIZE[beta]} rounded-md bg-[#F7B919] text-[#0b2545] font-extrabold leading-none tracking-wider uppercase select-none`}
      >
        Beta
      </span>
    </span>
  );
};

export default LiftMnLogo;
