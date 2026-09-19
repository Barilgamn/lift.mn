import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActiveSection } from '../types';
import { ROUTES } from '../routes';

interface BreadcrumbProps {
  section: Exclude<ActiveSection, 'portal'>;
  /** Дэд хуудасны нэр — жишээ нь барааны нэр. Байвал нэмэлт алхам болж орно. */
  trail?: string;
}

/**
 * Navbar-ын доорх нимгэн мөр. Хэрэглэгч аль хуудсанд байгаагаа
 * тодорхой харж, нэг товшилтоор портал руу буцах боломжтой.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ section, trail }) => {
  const current = ROUTES[section];

  return (
    <nav
      aria-label="Хаана байгаа"
      className="border-b border-line bg-surface-2 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1.5 h-10 text-[11px] sm:text-xs">
          <li>
            <Link
              to={ROUTES.portal.path}
              className="inline-flex items-center gap-1.5 text-ink-muted hover:text-brand-bright transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{ROUTES.portal.label}</span>
            </Link>
          </li>
          <li aria-hidden="true" className="text-ink-subtle">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li className="min-w-0">
            {trail ? (
              <Link
                to={current.path}
                className="font-bold text-ink-muted hover:text-brand-bright uppercase tracking-wider transition-colors"
              >
                {current.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-bold text-white uppercase tracking-wider">
                {current.label}
              </span>
            )}
          </li>

          {trail && (
            <>
              <li aria-hidden="true" className="text-ink-subtle shrink-0">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li className="min-w-0">
                <span aria-current="page" className="block font-bold text-white truncate">
                  {trail}
                </span>
              </li>
            </>
          )}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
