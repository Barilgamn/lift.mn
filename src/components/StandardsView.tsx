import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, Cpu, PhoneCall, ShieldCheck } from 'lucide-react';
import { STANDARD_GROUPS, TECH_SOLUTIONS } from '../data/standardsData';
import { HOTLINE } from '../lib/submitForm';
import { ROUTES } from '../routes';

/** Норм дүрэм · Техникийн шийдлүүд */
export const StandardsView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-0 text-ink">
      {/* Танилцуулга */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
          style={{ backgroundImage: `url('/images/cabins/atlas-gigas-traction-mrl.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#04101F] via-[#051329]/92 to-[#04101F]/78 pointer-events-none" />
        <div className="absolute -top-32 -left-24 w-[26rem] h-[26rem] rounded-full bg-brand/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/15 border border-brand/40 text-brand-bright text-xs font-bold uppercase tracking-wider mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Стандарт · Зөвлөгөө</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-ink mb-4">
            Норм дүрэм
            <span className="block text-brand-bright">ба техникийн шийдлүүд</span>
          </h1>
          <p className="text-sm md:text-base text-ink-muted leading-relaxed max-w-2xl mb-7">
            Лифт, урсдаг шатны зураг төсөл, суурилуулалт, ашиглалтад мөрддөг стандартууд болон
            барилгад тохирох техникийн шийдлийн товч лавлах.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#standards"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand hover:bg-brand-bright text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition"
            >
              <ShieldCheck className="w-4 h-4" />
              Норм дүрэм
            </a>
            <a
              href="#solutions"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-line hover:border-brand-bright text-ink font-bold text-xs sm:text-sm uppercase tracking-wider transition"
            >
              <Cpu className="w-4 h-4" />
              Техникийн шийдлүүд
            </a>
          </div>
        </div>
      </section>

      {/* Норм дүрэм */}
      <section id="standards" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-6 h-6 text-brand-bright" />
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Норм дүрэм</h2>
        </div>
        <p className="text-sm text-ink-muted max-w-3xl mb-8">
          Олон улсад хамгийн өргөн мөрддөг лифт, урсдаг шатны стандартууд. Монгол Улсын холбогдох
          стандарт (MNS), барилгын норм ба дүрмийн жагсаалтыг удахгүй нэмнэ.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {STANDARD_GROUPS.map((group) => (
            <div key={group.id} className="rounded-2xl bg-surface-2 border border-line p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-bright mb-4">
                {group.title}
              </h3>
              <ul className="space-y-4">
                {group.items.map((item) => (
                  <li key={item.code} className="flex gap-3">
                    <span className="shrink-0 h-6 px-2 rounded-md bg-brand/20 border border-brand/40 text-[11px] font-mono font-bold text-white flex items-center whitespace-nowrap">
                      {item.code}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-ink">{item.title}</div>
                      <p className="text-xs text-ink-muted leading-relaxed mt-0.5">{item.scope}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Техникийн шийдлүүд */}
      <section id="solutions" className="scroll-mt-24 border-t border-line bg-surface-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-6 h-6 text-brand-bright" />
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Техникийн шийдлүүд</h2>
          </div>
          <p className="text-sm text-ink-muted max-w-3xl mb-8">
            Барилгын төрөл, лифтийн нас, ашиглалтын ачаалалд тохирох шийдлийг манай инженерүүд
            газар дээр нь үзэж санал болгоно.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TECH_SOLUTIONS.map((s) => (
              <article
                key={s.id}
                className="group rounded-2xl bg-surface-2 border border-line hover:border-brand/60 p-5 flex flex-col transition"
              >
                <h3 className="text-base font-black text-ink mb-2 group-hover:text-brand-bright transition">
                  {s.title}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed mb-4">{s.summary}</p>
                <ul className="mt-auto space-y-1.5">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-xs text-ink">
                      <Check className="w-3.5 h-3.5 text-brand-bright shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {/* Зөвлөгөө авах */}
          <div className="mt-10 rounded-2xl bg-brand/15 border border-brand/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-black text-ink">Инженерийн зөвлөгөө авах</h3>
              <p className="text-xs md:text-sm text-ink-muted mt-1 max-w-xl">
                Таны барилгад аль шийдэл тохирохыг үзлэг хийж тодорхойлно. Хүсэлт үлдээх эсвэл шууд
                залгана уу.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                id="standards-cta-request"
                type="button"
                onClick={() => navigate(ROUTES.service.path)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand hover:bg-brand-bright text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Хүсэлт илгээх
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`tel:+976${HOTLINE.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-line hover:border-brand-bright text-ink font-bold text-xs uppercase tracking-wider transition"
              >
                <PhoneCall className="w-4 h-4" />
                {HOTLINE}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StandardsView;
