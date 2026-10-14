/**
 * Сайтын хэл — Google Website Translator-оор автомат орчуулна.
 *
 * Сайт Монгол хэл дээр бичигдсэн. EN / 中文 сонговол `googtrans` күүки
 * тавиад хуудсыг дахин ачаална; Google-ийн скрипт тэр күүкиг уншаад бүх
 * хуудсыг (барааны тайлбар хүртэл) орчуулна.
 *
 *   - Скрипт ЗӨВХӨН орчуулга идэвхтэй үед ачаалагдана — Монголоор үзэж
 *     буй зочинд гадны скрипт, нэмэлт хүлээлт байхгүй.
 *   - Орчуулагдахгүй байх ёстой зүйлд (лого, утас, барааны код)
 *     `translate="no"` тавина.
 *   - Админ хэсэгт орчуулга ачаалахгүй — маягтын утгыг эвдэж болзошгүй.
 */

export type Lang = 'mn' | 'en' | 'zh-CN';

export const LANGS: { code: Lang; label: string; title: string }[] = [
  { code: 'mn', label: 'MN', title: 'Монгол' },
  { code: 'en', label: 'EN', title: 'English' },
  { code: 'zh-CN', label: '中文', title: '中文' },
];

const COOKIE = 'googtrans';
const SCRIPT_ID = 'google-translate-script';
const SCRIPT_SRC = 'https://translate.google.com/translate_a/element.js?cb=liftmnTranslateInit';

/** Одоогийн хэл — `googtrans=/mn/en` күүкигээс */
export function currentLang(): Lang {
  if (typeof document === 'undefined') return 'mn';
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/;]*\/([^;]+)/);
  const code = m ? decodeURIComponent(m[1]) : 'mn';
  return (LANGS.some((l) => l.code === code) ? code : 'mn') as Lang;
}

/** Google күүкиг хост болон дээд домэйн (.lift.mn) аль алинд тавьдаг тул хоёуланд нь */
function cookieDomains(): (string | undefined)[] {
  const host = location.hostname;
  const parts = host.split('.');
  const out: (string | undefined)[] = [undefined, host];
  if (parts.length > 2) out.push('.' + parts.slice(-2).join('.'));
  else if (parts.length === 2) out.push('.' + host);
  return out;
}

function writeCookie(value: string | null) {
  for (const domain of cookieDomains()) {
    const d = domain ? `; domain=${domain}` : '';
    document.cookie = value
      ? `${COOKIE}=${value}; path=/${d}; max-age=31536000; SameSite=Lax`
      : `${COOKIE}=; path=/${d}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

/** Хэл солих — күүки тавиад (эсвэл арилгаад) хуудсыг дахин ачаална */
export function setLang(lang: Lang) {
  if (lang === currentLang()) return;
  writeCookie(lang === 'mn' ? null : `/mn/${lang}`);
  location.reload();
}

/**
 * Google орчуулга текстийн зангилааг <font>-оор ороодог тул React тэдгээрийг
 * устгах/оруулах үед "NotFoundError: removeChild" алдаа гарч хуудас
 * унадаг (facebook/react#11538). Эцэг нь өөрчлөгдсөн зангилааг чимээгүй
 * алгасна — зөвхөн орчуулга идэвхтэй үед.
 */
function patchDomForTranslation() {
  const proto = Node.prototype as Node & { __liftmnPatched?: boolean };
  if (proto.__liftmnPatched) return;
  proto.__liftmnPatched = true;
  const removeChild = proto.removeChild;
  proto.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };
  const insertBefore = proto.insertBefore;
  proto.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node;
    return insertBefore.call(this, node, ref) as T;
  };
}

declare global {
  interface Window {
    liftmnTranslateInit?: () => void;
    google?: { translate?: { TranslateElement: new (opts: object, id: string) => unknown } };
  }
}

/** Програм эхлэхэд нэг удаа — орчуулга идэвхтэй бол скриптийг ачаална */
export function initTranslate() {
  if (typeof window === 'undefined') return;
  if (location.pathname.startsWith('/admin')) return;
  if (currentLang() === 'mn') return;

  patchDomForTranslation();
  document.documentElement.classList.add('is-translated');

  if (!document.getElementById('google_translate_element')) {
    const holder = document.createElement('div');
    holder.id = 'google_translate_element';
    holder.style.display = 'none';
    document.body.appendChild(holder);
  }

  window.liftmnTranslateInit = () => {
    const T = window.google?.translate?.TranslateElement;
    if (!T) return;
    new T({ pageLanguage: 'mn', includedLanguages: 'en,zh-CN', autoDisplay: false }, 'google_translate_element');
  };

  if (!document.getElementById(SCRIPT_ID)) {
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.src = SCRIPT_SRC;
    s.async = true;
    document.head.appendChild(s);
  }
}
