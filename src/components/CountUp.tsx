import React, { useEffect, useMemo, useState } from 'react';
import { useInView } from '../lib/useReveal';

/**
 * Дэлгэцэд орж ирэхэд тоо өсөж гарч ирнэ.
 *
 * `value` нь "2007", "20+", "40+", "100+" гэх мэт тоо + дагавар хэлбэртэй.
 * Тоон хэсгийг нь салгаж аниматлаад дагаврыг нь хэвээр үлдээнэ. Оны тоог
 * 0-ээс тоолвол утгагүй харагддаг тул 25 нэгжийн өмнөхөөс эхэлнэ.
 *
 * ЧУХАЛ: useEffect-ийн хамаарал нь зөвхөн тогтвортой утгууд байх ёстой.
 * Өмнө нь энд RegExp-ийн үр дүнг шууд хамааралд өгсөн байсан бөгөөд тэр нь
 * render бүрд шинэ объект болдог тул эффект байнга дахин эхэлж, тоо
 * эхний утган дээрээ гацдаг байв.
 */
const DURATION = 1100;

export const CountUp: React.FC<{ value: string; className?: string }> = ({
  value,
  className = '',
}) => {
  const { target, suffix, numeric } = useMemo(() => {
    const m = /^(\d+)(.*)$/.exec(value.trim());
    return m
      ? { target: Number(m[1]), suffix: m[2], numeric: true }
      : { target: 0, suffix: value, numeric: false };
  }, [value]);

  const [ref, inView] = useInView<HTMLSpanElement>();
  // Хөдөлгөөн эхлэх хүртэл эцсийн утгаа харуулна — JS ажиллахгүй үед ч зөв
  const [shown, setShown] = useState(target);

  useEffect(() => {
    if (!numeric || !inView) return;
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
  }, [inView, numeric, target]);

  if (!numeric) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {/* Дэлгэц уншигч программд эцсийн утгыг нэг мөсөн уншуулна */}
      <span aria-hidden>{shown}{suffix}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
};

export default CountUp;
