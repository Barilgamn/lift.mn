import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { ImageZoom } from './ImageZoom';

/**
 * Хажуугийн текстийн өндөртэй тэнцүү болж сунадаг зургийн гулсагч.
 *
 * Танилцуулгын хэсгүүдэд текст урт, зураг богино байсан тул баруун тал нь
 * хоосон харагддаг байв. Энд зургийг нэг нэгээр нь бүтэн өндрөөр үзүүлж,
 * сумаар сольж хардаг болгосон — ингэснээр хоёр багана ижил өндөртэй
 * болохын зэрэгцээ зураг нь ч томоор харагдана.
 *
 * Зураг дээр дарахад бүтэн дэлгэцээр томорно.
 */

export interface SliderImage {
  src: string;
  alt: string;
  /** Зургийн доор гарах богино тайлбар */
  caption?: string;
}

export const ImageSlider: React.FC<{
  images: SliderImage[];
  /** Зураг хүрээндээ багтах (contain) эсвэл дүүргэх (cover) эсэх */
  fit?: 'cover' | 'contain';
  /** Нэг баганад ганцаараа байх үеийн доод өндөр */
  className?: string;
}> = ({ images, fit = 'cover', className = '' }) => {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<SliderImage | null>(null);

  if (images.length === 0) return null;

  const many = images.length > 1;
  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);
  const current = images[index];

  return (
    <div
      className={`group relative h-full min-h-72 sm:min-h-80 overflow-hidden rounded-xl border border-line bg-surface-3 ${className}`}
      // Сум товчнууд focus-д орсон үед л биш, бүхэлдээ гарнаас удирдахаар
      onKeyDown={(e) => {
        if (!many) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      }}
    >
      {images.map((img, i) => (
        <button
          key={img.src}
          type="button"
          tabIndex={i === index ? 0 : -1}
          aria-hidden={i === index ? undefined : true}
          onClick={() => setZoom(img)}
          aria-label={`${img.alt} — томруулж харах`}
          className={`absolute inset-0 w-full h-full cursor-zoom-in transition-opacity duration-500 ${
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            className={`w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain p-4'}`}
          />
        </button>
      ))}

      {/* Томруулах тэмдэг */}
      <span className="pointer-events-none absolute top-3 left-3 w-8 h-8 rounded-lg bg-black/45 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ZoomIn className="w-4 h-4" />
      </span>

      {many && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Өмнөх зураг"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Дараагийн зураг"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <span className="absolute top-3 right-3 px-2.5 h-7 rounded-full bg-black/45 border border-white/20 text-white text-[11px] font-bold tabular-nums flex items-center">
            {index + 1} / {images.length}
          </span>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-3 pt-10 bg-gradient-to-t from-black/60 to-transparent">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}-р зураг`}
                aria-current={i === index ? 'true' : undefined}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {current.caption && (
        <p
          className={`absolute inset-x-0 ${many ? 'bottom-8' : 'bottom-0'} px-4 pb-2 pt-8 text-[11px] sm:text-xs text-white/90 bg-gradient-to-t from-black/70 to-transparent pointer-events-none`}
        >
          {current.caption}
        </p>
      )}

      {zoom && <ImageZoom src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />}
    </div>
  );
};

export default ImageSlider;
