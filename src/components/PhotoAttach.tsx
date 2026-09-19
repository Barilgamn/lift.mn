import React, { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { attachPhoto, formatBytes, MAX_PHOTOS } from '../lib/photoAttach';

export interface Photo {
  dataUrl: string;
  bytes: number;
  name: string;
}

interface PhotoAttachProps {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
  /** Талбарын тайлбар — маягт бүрт өөр байж болно */
  hint?: string;
  label?: string;
}

/**
 * Зураг хавсаргах талбар.
 *
 * Сонгосон зургийг хөтөч дээр шахаад урьдчилан харуулна. Хэрэглэгч
 * илгээхийнхээ өмнө буруу зургаа хасах боломжтой.
 */
export const PhotoAttach: React.FC<PhotoAttachProps> = ({
  photos,
  onChange,
  label = 'Барааны зураг',
  hint = 'Пайз, загварын дугаар, эвдэрсэн хэсэг харагдахаар авбал хамгийн тохиромжтой.',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const full = photos.length >= MAX_PHOTOS;

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setError('');
    setBusy(true);

    const room = MAX_PHOTOS - photos.length;
    const chosen = Array.from(fileList).slice(0, room);
    const skipped = fileList.length - chosen.length;

    const added: Photo[] = [];
    const problems: string[] = [];

    for (const file of chosen) {
      const result = await attachPhoto(file);
      if (result.status === 'ok') {
        added.push({ dataUrl: result.dataUrl, bytes: result.bytes, name: file.name });
      } else {
        problems.push(result.message);
      }
    }

    if (skipped > 0) problems.push(`Хамгийн ихдээ ${MAX_PHOTOS} зураг хавсаргана.`);

    if (added.length) onChange([...photos, ...added]);
    setError(problems.join(' '));
    setBusy(false);

    // Ижил файлыг дахин сонгож болохын тулд цэвэрлэнэ
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = (index: number) => {
    setError('');
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block font-semibold text-ink-muted mb-1">
        {label}{' '}
        <span className="font-normal text-ink-subtle">
          (заавал биш, {MAX_PHOTOS} хүртэл)
        </span>
      </label>

      {photos.length > 0 && (
        <ul className="flex flex-wrap gap-2.5 mb-2.5">
          {photos.map((photo, index) => (
            <li key={photo.dataUrl.slice(-40) + index} className="relative">
              <img
                src={photo.dataUrl}
                alt={photo.name}
                className="w-20 h-20 object-cover rounded-xl border border-line"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`${photo.name} зургийг хасах`}
                // Дэвсгэр нь үргэлж бараан тул текстийн өнгийг гаднаас нь
                // заана — theme-light хэсэгт text-ink бараан болж дарагдана
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-neutral-900 border border-white/30 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-400 cursor-pointer transition-colors shadow-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <span className="block mt-1 text-[10px] text-ink-subtle text-center tabular-nums">
                {formatBytes(photo.bytes)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      <button
        type="button"
        disabled={busy || full}
        onClick={() => inputRef.current?.click()}
        className="w-full h-11 px-3 rounded-xl bg-surface-3 border border-dashed border-line-strong text-ink-muted text-xs font-semibold flex items-center justify-center gap-2 hover:border-brand-bright hover:text-ink cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Зураг боловсруулж байна…</span>
          </>
        ) : (
          <>
            <ImagePlus className="w-4 h-4" />
            <span>{full ? `${MAX_PHOTOS} зураг хавсаргасан` : 'Зураг сонгох эсвэл авах'}</span>
          </>
        )}
      </button>

      {error ? (
        <p role="alert" className="mt-1.5 text-[11px] text-danger-soft leading-relaxed">
          {error}
        </p>
      ) : (
        <p className="mt-1.5 text-[11px] text-ink-subtle leading-relaxed">{hint}</p>
      )}
    </div>
  );
};
