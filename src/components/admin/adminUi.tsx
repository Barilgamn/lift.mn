import React from 'react';
import { ElevatorStatus, ServiceKind, SubmissionKind, SubmissionStatus } from '../../types';

/** Админ хэсгийн бүх хуудсанд ижил төлөвийн тэмдэглэгээ */

const TONE: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  blue: 'bg-sky-50 text-sky-800 border-sky-200',
  amber: 'bg-amber-50 text-amber-900 border-amber-200',
  red: 'bg-red-50 text-red-800 border-red-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const Badge: React.FC<{ tone?: keyof typeof TONE; children: React.ReactNode }> = ({
  tone = 'slate',
  children,
}) => (
  <span
    className={`inline-flex items-center h-6 px-2 rounded-md border text-[11px] font-bold whitespace-nowrap ${TONE[tone]}`}
  >
    {children}
  </span>
);

export const ELEVATOR_STATUS: Record<ElevatorStatus, { label: string; tone: keyof typeof TONE }> = {
  operational: { label: 'Хэвийн', tone: 'green' },
  maintenance: { label: 'Үйлчилгээнд', tone: 'blue' },
  fault: { label: 'Эвдрэлтэй', tone: 'red' },
  offline: { label: 'Зогссон', tone: 'slate' },
};

export const SUBMISSION_KIND: Record<SubmissionKind, { label: string; tone: keyof typeof TONE }> = {
  'service-ticket': { label: 'Засварын хүсэлт', tone: 'blue' },
  emergency: { label: 'Яаралтай дуудлага', tone: 'red' },
  booking: { label: 'Цаг захиалга', tone: 'blue' },
  quote: { label: 'Үнийн санал', tone: 'amber' },
  sourcing: { label: 'Сэлбэг хайх', tone: 'amber' },
  order: { label: 'Захиалга', tone: 'green' },
};

export const SUBMISSION_STATUS: Record<SubmissionStatus, { label: string; tone: keyof typeof TONE }> = {
  new: { label: 'Шинэ', tone: 'amber' },
  'in-progress': { label: 'Ажиллаж байна', tone: 'blue' },
  done: { label: 'Шийдвэрлэсэн', tone: 'green' },
};

export const SERVICE_KIND: Record<ServiceKind, { label: string; tone: keyof typeof TONE }> = {
  routine: { label: 'Хуваарьт үзлэг', tone: 'blue' },
  repair: { label: 'Засвар', tone: 'amber' },
  emergency: { label: 'Яаралтай', tone: 'red' },
  inspection: { label: 'Магадлал', tone: 'green' },
};

export const OUTCOME: Record<string, { label: string; tone: keyof typeof TONE }> = {
  resolved: { label: 'Шийдэгдсэн', tone: 'green' },
  'awaiting-parts': { label: 'Сэлбэг хүлээж буй', tone: 'amber' },
  monitoring: { label: 'Хяналтад', tone: 'blue' },
};

/** Хуудасны толгой */
export const PageHead: React.FC<{
  title: string;
  lead?: string;
  right?: React.ReactNode;
}> = ({ title, lead, right }) => (
  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div>
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-ink-dark">{title}</h1>
      {lead && <p className="mt-1 text-xs sm:text-sm text-ink-dark-muted">{lead}</p>}
    </div>
    {right}
  </div>
);

/** Цагаан хайрцаг */
export const Panel: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <div className={`rounded-xl bg-paper border border-line-light ${className}`}>{children}</div>
);
