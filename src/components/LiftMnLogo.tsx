import React from 'react';

/**
 * LIFT.MN-ийн лого.
 *
 * Эх файл нь JPG байсныг вектор болгож (public/lift-mn.svg) хөх, шар хоёр
 * давхаргатайгаар зурав — ямар ч хэмжээнд хурц, дэвсгэр нь тунгалаг.
 * Өндрийг нь `className`-аар өгнө, өргөн нь харьцаагаараа тохирно.
 */
export const LiftMnLogo: React.FC<{ className?: string }> = ({ className = 'h-8' }) => (
  <img
    src="/lift-mn.svg"
    alt="LIFT.MN"
    width={639}
    height={127}
    className={`w-auto select-none ${className}`}
    draggable={false}
  />
);

export default LiftMnLogo;
