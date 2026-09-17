import React from 'react';

/**
 * Хуудас бүрт дахин ашиглах элементүүд.
 *
 * Зорилго нь зай, булан, өнгө, товчны өндрийг нэг мөр болгох. Өмнө нь хуудас
 * бүр өөрийн гэсэн хэмжээ, өнгөтэй байсан тул нэг сайт мэт харагдахгүй байв.
 */

type IconType = React.ComponentType<{ className?: string }>;

/* ------------------------------------------------------------------ Хэсэг */

interface SectionProps {
  id?: string;
  /** 'alt' нь зэргэлдээ хэсгээс ялгарах бага зэрэг цайвар дэвсгэр */
  tone?: 'base' | 'alt';
  /** Доод зураас хэрэггүй бол false */
  divider?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  id,
  tone = 'base',
  divider = true,
  className = '',
  children,
}) => (
  <section
    id={id}
    className={`py-14 sm:py-16 md:py-20 ${tone === 'alt' ? 'bg-surface-2' : 'bg-surface-1'} ${
      divider ? 'border-b border-line' : ''
    } ${className}`}
  >
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
  </section>
);

/** Хэсгийн дээд талын жижиг шошго */
export const SectionLabel: React.FC<{ icon?: IconType; children: React.ReactNode }> = ({
  icon: Icon,
  children,
}) => (
  <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-brand/15 border border-brand/40 text-brand-bright text-[11px] font-bold uppercase tracking-wider">
    {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
    {children}
  </span>
);

interface SectionHeadingProps {
  icon?: IconType;
  label?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
}

/** Шошго + гарчиг + тайлбар — бүх хэсэгт ижил хэмжээтэй */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  icon,
  label,
  title,
  lead,
  className = '',
}) => (
  <div className={className}>
    {label && <SectionLabel icon={icon}>{label}</SectionLabel>}
    <h2
      className={`${label ? 'mt-4' : ''} text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-ink`}
    >
      {title}
    </h2>
    {lead && <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed max-w-2xl">{lead}</p>}
  </div>
);

/* -------------------------------------------------------------------- Карт */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Дарж болох карт — hover, focus төлөвтэй */
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  interactive = false,
  className = '',
  children,
  ...rest
}) => (
  <div
    className={`rounded-card bg-surface-3 border border-line ${
      interactive ? 'transition-colors hover:border-brand hover:bg-surface-4 cursor-pointer' : ''
    } ${className}`}
    {...rest}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------- Товч */

type ButtonVariant = 'primary' | 'accent' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand hover:bg-brand-hover text-white border border-transparent',
  accent: 'bg-accent hover:bg-accent-hover text-surface-0 border border-transparent',
  ghost: 'bg-white/5 hover:bg-white/10 text-ink border border-line-strong',
  danger: 'bg-danger/20 hover:bg-danger/30 text-danger-soft border border-danger/50',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[11px]',
  md: 'h-11 px-5 text-xs',
  lg: 'h-12 px-6 text-sm',
};

/** Товч, холбоос хоёрт ижил хэлбэр өгөх класс */
export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra = ''
): string {
  return [
    'inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-wider',
    'transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    VARIANTS[variant],
    SIZES[size],
    extra,
  ].join(' ');
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) => (
  <button className={buttonClass(variant, size, className)} {...rest}>
    {children}
  </button>
);

/* ------------------------------------------------------------------- Шошго */

/** Жижиг шошго — бүгд ижил өндөртэй */
export const Chip: React.FC<{ tone?: 'default' | 'brand'; className?: string; children: React.ReactNode }> = ({
  tone = 'default',
  className = '',
  children,
}) => (
  <span
    className={`inline-flex items-center h-7 px-2.5 rounded-lg text-[11px] font-semibold tracking-wide ${
      tone === 'brand'
        ? 'bg-brand/25 border border-brand/60 text-white'
        : 'bg-white/[0.06] border border-line text-ink-muted'
    } ${className}`}
  >
    {children}
  </span>
);

/* ----------------------------------------------------------------- Талбар */

/** Формын талбарт нэгдсэн загвар өгөх класс */
export const controlClass =
  'w-full h-11 px-3 rounded-xl bg-surface-2 border border-line text-ink text-sm ' +
  'placeholder:text-ink-subtle focus:border-brand-bright focus:outline-none transition-colors';

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/** Нэр + талбар + алдааны мэдэгдэл */
export const Field: React.FC<FieldProps> = ({
  label,
  htmlFor,
  required,
  error,
  hint,
  className = '',
  children,
}) => (
  <div className={className}>
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5"
    >
      {label}
      {required && <span className="text-accent ml-0.5">*</span>}
    </label>
    {children}
    {error ? (
      <p className="mt-1.5 text-[11px] text-danger-soft">{error}</p>
    ) : hint ? (
      <p className="mt-1.5 text-[11px] text-ink-subtle">{hint}</p>
    ) : null}
  </div>
);

/* ----------------------------------------------------------------- Тоо */

/** Гол үзүүлэлт харуулах хайрцаг */
export const Stat: React.FC<{ value: string; label: string; className?: string }> = ({
  value,
  label,
  className = '',
}) => (
  <div className={className}>
    <div className="text-3xl sm:text-4xl font-black text-accent tabular-nums">{value}</div>
    <div className="mt-1.5 text-[11px] sm:text-xs text-ink-muted leading-snug">{label}</div>
  </div>
);
