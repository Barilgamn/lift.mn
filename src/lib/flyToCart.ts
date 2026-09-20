/**
 * Сагсанд нэмэхэд барааг сагс руу "нисгэх" хөдөлгөөн.
 *
 * Товч дарахад юу болсон нь мэдэгдэхгүй байсан — зөвхөн буланд жижиг
 * мэдэгдэл гарч, сагсны тоо чимээгүй нэмэгддэг байв. Энэ нь барааг
 * дарсан газраас цэсний сагс руу нисгэж, хаашаа орсныг нүдээр харуулна.
 *
 * React-ийн гадна, шууд DOM дээр ажиллана: хөдөлгөөн нь ямар ч төлөв
 * өөрчлөхгүй тул хуудас дахин зурагдахгүй.
 */

/** Цэсний сагсны товч — бүх дэд хуудсанд байдаг */
const CART_BUTTON_ID = 'nav-cart-btn';

/** Сагсны тоо үсрэх хөдөлгөөнийг эхлүүлэх дохио */
export const CART_BUMP_EVENT = 'lift:cart-bump';

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Сагсны тоог үсрүүлэх дохиог илгээнэ */
function bumpCart() {
  window.dispatchEvent(new CustomEvent(CART_BUMP_EVENT));
}

/**
 * `from` элементээс сагс руу нисэх хуулбар үүсгэнэ.
 *
 * @param from  Дарсан товч эсвэл картын элемент
 * @param image Нисэх зураг. Байхгүй бол дугуй цэг нисгэнэ.
 */
export function flyToCart(from: Element | null, image?: string): void {
  const cart = document.getElementById(CART_BUTTON_ID);

  // Хөдөлгөөн багасгах горимд эсвэл сагс харагдахгүй байвал зөвхөн тоог үсрүүлнэ
  if (!from || !cart || reducedMotion()) {
    bumpCart();
    return;
  }

  const start = from.getBoundingClientRect();
  const end = cart.getBoundingClientRect();
  if (!start.width || !end.width) {
    bumpCart();
    return;
  }

  const size = 56;
  const ghost = document.createElement('div');
  ghost.setAttribute('aria-hidden', 'true');
  // Шалгалт, оношилгоонд олдоход зориулав
  ghost.dataset.flyGhost = '';
  ghost.style.cssText = [
    'position:fixed',
    'z-index:60',
    'pointer-events:none',
    `width:${size}px`,
    `height:${size}px`,
    `left:${start.left + start.width / 2 - size / 2}px`,
    `top:${start.top + start.height / 2 - size / 2}px`,
    'border-radius:14px',
    'overflow:hidden',
    'background:#ffffff',
    'box-shadow:0 12px 30px rgba(0,0,0,.45)',
    'will-change:transform,opacity',
  ].join(';');

  if (image) {
    const img = document.createElement('img');
    img.src = image;
    img.alt = '';
    img.style.cssText = 'width:100%;height:100%;object-fit:contain';
    ghost.appendChild(img);
  } else {
    ghost.style.background = '#0063A5';
    ghost.style.borderRadius = '50%';
  }

  document.body.appendChild(ghost);

  const dx = end.left + end.width / 2 - (start.left + start.width / 2);
  const dy = end.top + end.height / 2 - (start.top + start.height / 2);

  // Нуман зам: эхлээд дээшээ бага зэрэг өргөгдөөд сагс руу унана
  const animation = ghost.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1, offset: 0 },
      {
        transform: `translate(${dx * 0.45}px, ${dy * 0.35 - 70}px) scale(0.78)`,
        opacity: 1,
        offset: 0.55,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(0.18)`, opacity: 0.25, offset: 1 },
    ],
    { duration: 680, easing: 'cubic-bezier(.34,.01,.5,1)', fill: 'forwards' }
  );

  animation.onfinish = () => {
    ghost.remove();
    bumpCart();
  };
  // Хөтөч хөдөлгөөнийг зогсоовол хуулбар үлдэхгүй байх баталгаа
  animation.oncancel = () => {
    ghost.remove();
    bumpCart();
  };
}
