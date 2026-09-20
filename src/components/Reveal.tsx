import React from 'react';
import { useInView } from '../lib/useReveal';

/**
 * Гүйлгэхэд доороос зөөлөн гарч ирэх бүрхүүл.
 *
 * Хөдөлгөөнийг CSS хийнэ (`.reveal` / `.is-in`), энд зөвхөн хэзээ
 * харагдсаныг мэдээлнэ. `prefers-reduced-motion` тохиргоотой хэрэглэгчид
 * агуулга шууд харагдана — index.css дотор унтраасан.
 */
export const Reveal: React.FC<{
  children: React.ReactNode;
  /** Дараалан гарах хоцролт (мс) */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'figure';
}> = ({ children, delay = 0, className = '', as: Tag = 'div' }) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
