import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

/**
 * Facebook, Messenger зэрэг нь JavaScript ажиллуулдаггүй, зөвхөн HTML-ийн
 * og: тагийг уншдаг. SPA бүх хаягт ижил index.html өгдөг тул хуваалцсан
 * холбоос бүр ерөнхий LIFT.MN зургийг харуулна.
 *
 * Тиймээс build-ийн дараа зарим хуудсанд index.html-ийн хуулбарыг өөрийн
 * гарчиг, тайлбар, зурагтай үүсгэнэ (dist/<нэр>.html). vercel.json тэр
 * хаягийг энэ файл руу чиглүүлнэ; хуудас ачаалагдмагц React ердийнхөөрөө
 * ажиллана.
 */
const SITE = 'https://www.lift.mn';
const SOCIAL_PAGES: {file: string; path: string; title: string; description: string; image: string; imageAlt: string}[] = [
  {
    file: 'sportnaadam.html',
    path: '/sportnaadam',
    title: '17-р спортын их наадам 2026 — бүртгэл',
    description:
      'Өргөх байгууламжийн салбарын мэргэжлийн байгууллагуудын 17-р спортын их наадам. ' +
      '2026.11.07–08, GAN Sports Center, ATTILA. Байгууллагаа бүртгүүлээрэй!',
    image: '/og-sportnaadam.jpg',
    imageAlt: '17-р спортын их наадам — 2026.11.07–08, GAN Sports Center, ATTILA',
  },
];

const escapeAttr = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function socialPages(): Plugin {
  let outDir = 'dist';
  return {
    name: 'liftmn-social-pages',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const base = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      for (const page of SOCIAL_PAGES) {
        const meta = (attr: 'property' | 'name', key: string, value: string) => (html: string) => {
          const tag = `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`;
          const re = new RegExp(`<meta ${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`);
          return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
        };
        let html = base.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(page.title)} | LIFT.MN</title>`);
        for (const apply of [
          meta('name', 'description', page.description),
          meta('property', 'og:title', page.title),
          meta('property', 'og:description', page.description),
          meta('property', 'og:url', SITE + page.path),
          meta('property', 'og:image', SITE + page.image),
          meta('property', 'og:image:alt', page.imageAlt),
          meta('name', 'twitter:image', SITE + page.image),
        ]) html = apply(html);
        fs.writeFileSync(path.join(outDir, page.file), html);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), socialPages()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
