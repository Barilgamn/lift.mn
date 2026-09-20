import React, { useEffect, useState } from 'react';
import { useInView } from '../lib/useReveal';

/**
 * Дэлгэцэд орж ирэхэд тоо өсөж гарч ирнэ.
 *
 * `value` нь "2007", "20+", "40+", "100+" гэх мэт тоо + дагавар хэлбэртэй.
 * Тоон хэсгийг нь салгаж аниматлаад дагаврыг нь хэвээр үлдээнэ. Оны тоог
 * 0-ээс тоолвол утгагүй харагддаг тул 25 нэгжийн өмнөхөөс эхэлнэ.
 */
const DURATION = 1100;

export const CountUp: React.FC<{ value: string; className?: string }> = ({
  value,
  className = '',
}) => {
  const match = /^(\d+)(.*)$/.exec(value.trim());
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;

  const [ref, inView] = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState(target);

  useEffect(() => {
    if (!match || !inView) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const from = target > 1000 ? target - 25 : 0;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      // Төгсгөл рүүгээ удаашрах — гэнэт зогссон мэт харагдахгүй
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (target - from) * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    setShown(from);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, match]);

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {/* Хөтчөөр уншигчид эцсийн утгыг нэг мөсөн уншина */}
      <span aria-hidden>{shown}{suffix}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
};

export default CountUp;
