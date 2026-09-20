import { useEffect, useRef, useState } from 'react';

/**
 * Элемент дэлгэцэд орж ирэхэд нэг удаа `true` болно.
 *
 * Гүйлгэхэд гарч ирэх хөдөлгөөнд ашиглана. Нэг л удаа ажиллаад
 * ажиглалтаа салгадаг тул дээш доош гүйлгэхэд агуулга анивчихгүй.
 * Хөтөч IntersectionObserver дэмжихгүй бол шууд харагдана.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '0px 0px -12% 0px'
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { rootMargin, threshold: 0.08 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, inView];
}
