import React from 'react';

/**
 * Нүүр хуудасны гурван картын гараар зурсан, хөдөлгөөнтэй дүрс.
 *
 *   - Сэлбэг: хайрцагнаас гарч буй хоёр араа эсрэг чиглэлд эргэнэ
 *   - Засвар: лифтний хаалга нээгдэж (дотор нь зорчигч), түлхүүр сэгсрэнэ
 *   - Норм дүрэм: баримтын мөрүүд бичигдэж, баталгааны тэмдэг зурагдана
 *
 * Хөдөлгөөн нь src/index.css-ийн `pi-*` keyframes. Карт дээр хулганаа
 * авчрахад (group-hover) хурдасна. "Хөдөлгөөнийг багасгах" тохиргоотой
 * хэрэглэгчид хөдөлгөөнгүй харагдана.
 */

const NAVY = '#0B3F78';
const BLUE = '#1468B8';
const SKY = '#38BDF8';
const YELLOW = '#F7C600';

/** Шүдтэй араа — trapezoid шүдтэй олон өнцөгт */
function gearPath(cx: number, cy: number, teeth: number, ro: number, ri: number): string {
  const step = (Math.PI * 2) / teeth;
  const pt = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    pts.push(pt(ri, a - step * 0.5), pt(ro, a - step * 0.22), pt(ro, a + step * 0.22), pt(ri, a + step * 0.5));
  }
  return `M${pts.join('L')}Z`;
}

const BIG_GEAR = gearPath(41, 23, 10, 13, 10);
const SMALL_GEAR = gearPath(22.5, 16.5, 8, 8.4, 6.2);

type IconProps = { className?: string };

export const PartsIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg viewBox="0 0 64 64" className={`pi pi-parts ${className}`} aria-hidden="true">
    <defs>
      <linearGradient id="pi-box" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1C7DD6" />
        <stop offset="1" stopColor={NAVY} />
      </linearGradient>
    </defs>
    {/* Араанууд — хайрцагны ард */}
    <g className="pi-gear-big">
      <path d={BIG_GEAR} fill={SKY} stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="41" cy="23" r="4.2" fill="#fff" stroke={NAVY} strokeWidth="1.8" />
    </g>
    <g className="pi-gear-small">
      <path d={SMALL_GEAR} fill={YELLOW} stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="22.5" cy="16.5" r="2.4" fill="#fff" stroke={NAVY} strokeWidth="1.6" />
    </g>
    {/* Хайрцаг */}
    <g className="pi-box">
      <rect x="9" y="37" width="38" height="20" rx="3.5" fill="url(#pi-box)" stroke={NAVY} strokeWidth="1.8" />
      <path d="M7 35.5 Q7 33 9.5 33 H46.5 Q49 33 49 35.5 V39 H7 Z" fill={BLUE} stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="24.5" y="33" width="7" height="24" fill={YELLOW} stroke={NAVY} strokeWidth="1.4" />
      <path d="M13 45 H20 M13 49.5 H18" stroke="#BFE3FB" strokeWidth="1.8" strokeLinecap="round" />
    </g>
    {/* Гялбаа */}
    <path className="pi-spark" d="M54 40 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4z" fill={YELLOW} stroke={NAVY} strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

export const ServiceIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg viewBox="0 0 64 64" className={`pi pi-service ${className}`} aria-hidden="true">
    <defs>
      <clipPath id="pi-cabin">
        <rect x="14.5" y="16.5" width="27" height="36" rx="1.5" />
      </clipPath>
      <linearGradient id="pi-door" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1C7DD6" />
        <stop offset="1" stopColor={BLUE} />
      </linearGradient>
    </defs>
    {/* Хүрээ */}
    <rect x="11" y="6" width="34" height="50" rx="4.5" fill="#EAF4FD" stroke={NAVY} strokeWidth="2" />
    {/* Давхрын заагч */}
    <rect x="21" y="9.5" width="14" height="5" rx="2.5" fill={NAVY} />
    <path className="pi-arrow" d="M28 10.6 l2.6 2.8 h-5.2z" fill={YELLOW} />
    {/* Кабины дотор — зорчигч */}
    <g clipPath="url(#pi-cabin)">
      <rect x="14.5" y="16.5" width="27" height="36" fill="#FFF7D6" />
      <g className="pi-rider">
        <circle cx="28" cy="31" r="4" fill={NAVY} />
        <path d="M20.5 52.5 Q20.5 37.5 28 37.5 Q35.5 37.5 35.5 52.5 Z" fill={SKY} stroke={NAVY} strokeWidth="1.6" />
      </g>
      {/* Хаалганы хоёр тал */}
      <g className="pi-door-l">
        <rect x="14.5" y="16.5" width="13.5" height="36" fill="url(#pi-door)" stroke={NAVY} strokeWidth="1.4" />
        <path d="M24.5 31 v7" stroke="#BFE3FB" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g className="pi-door-r">
        <rect x="28" y="16.5" width="13.5" height="36" fill="url(#pi-door)" stroke={NAVY} strokeWidth="1.4" />
        <path d="M31.5 31 v7" stroke="#BFE3FB" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </g>
    <rect x="14.5" y="16.5" width="27" height="36" rx="1.5" fill="none" stroke={NAVY} strokeWidth="1.8" />
    {/* Түлхүүр */}
    <g className="pi-wrench">
      <path
        d="M57.6 33.8 a7.2 7.2 0 0 1 -9.3 9.2 l-9.7 9.7 a3.1 3.1 0 0 1 -4.4 -4.4 l9.7 -9.7 a7.2 7.2 0 0 1 9.2 -9.3 l-4.6 4.6 1.1 3.4 3.4 1.1z"
        fill={YELLOW}
        stroke={NAVY}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <circle cx="36.4" cy="50.5" r="1.1" fill={NAVY} />
    </g>
  </svg>
);

export const StandardsIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg viewBox="0 0 64 64" className={`pi pi-standards ${className}`} aria-hidden="true">
    {/* Ард нь хоёр дахь хуудас */}
    <rect className="pi-page-back" x="16" y="5" width="32" height="42" rx="4" fill="#D6EBFB" stroke={NAVY} strokeWidth="1.8" />
    {/* Үндсэн хуудас, нугалсан булан */}
    <path d="M12 12 Q12 9 15 9 H36 L44 17 V49 Q44 52 41 52 H15 Q12 52 12 49 Z" fill="#fff" stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
    <path d="M36 9 V14.5 Q36 17 38.5 17 H44" fill="#EAF4FD" stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" />
    {/* Гарчиг ба бичигдэж буй мөрүүд */}
    <rect x="17" y="15" width="12" height="4" rx="2" fill={BLUE} />
    <path className="pi-line pi-line-1" d="M17 25 H38" stroke={SKY} strokeWidth="2.6" strokeLinecap="round" pathLength={1} />
    <path className="pi-line pi-line-2" d="M17 31 H35" stroke={SKY} strokeWidth="2.6" strokeLinecap="round" pathLength={1} />
    <path className="pi-line pi-line-3" d="M17 37 H31" stroke={SKY} strokeWidth="2.6" strokeLinecap="round" pathLength={1} />
    {/* Баталгааны тэмдэг */}
    <g className="pi-seal">
      <circle cx="44" cy="45" r="11" fill={YELLOW} stroke={NAVY} strokeWidth="2" />
      <circle cx="44" cy="45" r="7.6" fill="none" stroke={NAVY} strokeWidth="1" strokeDasharray="1.6 1.8" opacity="0.55" />
      <path className="pi-check" d="M39.2 45.2 l3.3 3.3 6.4 -6.8" fill="none" stroke={NAVY} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
    </g>
  </svg>
);
