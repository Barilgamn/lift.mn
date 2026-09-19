import React, { useEffect, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

/**
 * Зургийг бүтэн дэлгэцээр томруулж харуулах давхарга.
 *
 * Сэлбэгийн пайз дээрх код, холбогчийн хэлбэр зэргийг таних гол арга нь
 * зураг тул жижиг хуулбараар шийдэх боломжгүй. Дарахад энд томроно.
 */
export const ImageZoom: React.FC<{
  src: string;
  alt: string;
  onClose: () => void;
}> = ({ src, alt, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — томруулсан зураг`}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm cursor-zoom-out animate-fadeIn"
    >
      {/*
        * Зургийг дэлгэц дүүрэн томруулна. Каталогийн зураг PDF дотроо
        * ~250 пиксел байсан тул томруулахад зөөлөрч харагдана — гэхдээ
        * 64 пиксел хуулбараас хамаагүй уншигдахуйц. Админаас оруулсан
        * зураг 1280 пиксел тул хурц гарна.
        */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="w-auto h-auto max-w-[92vw] max-h-[80dvh] min-w-[min(88vw,560px)] object-contain rounded-xl bg-white shadow-2xl cursor-default"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Хаах"
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs">
        {alt}
      </p>
    </div>
  );
};

/** Дарахад томордог зураг — нүдээр танихаар томруулах тэмдэгтэй */
export const ZoomableImage: React.FC<{
  src?: string;
  alt: string;
  onZoom: (src: string, alt: string) => void;
  className: string;
  fallbackClassName: string;
  iconClassName?: string;
  children?: React.ReactNode;
}> = ({ src, alt, onZoom, className, fallbackClassName, iconClassName, children }) => {
  const [failed, setFailed] = useState(false);

  // Зураг байхгүй эсвэл ачаалагдаагүй бол орлуулагчийг харуулна — эс бөгөөс
  // хөтчийн "тасарсан зураг" тэмдэг гарч ирнэ
  if (!src || failed) {
    return <div className={`${fallbackClassName} flex items-center justify-center`}>{children}</div>;
  }
  return (
    <button
      type="button"
      onClick={() => onZoom(src, alt)}
      aria-label={`${alt} зургийг томруулж харах`}
      className={`group/zoom relative overflow-hidden cursor-zoom-in ${fallbackClassName}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={className}
      />
      <span className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/55 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/zoom:opacity-100 transition-opacity">
        <ZoomIn className={iconClassName ?? 'w-3.5 h-3.5'} />
      </span>
    </button>
  );
};
