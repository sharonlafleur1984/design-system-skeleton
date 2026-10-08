import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { useGlassLight } from '../glass-light/glass-light';
import './page-shell.css';

// After Graduation's page shell (Decisions, Oct 4): the header runs edge to edge and the page is a
// sheet that rises over its bottom edge (Oct 7: the sheet is as wide as the header's content and always
// sits in from the screen sides, so the header's red frames the page on every screen size). All spacing comes from the layout and shell tokens.
//
// The art: a magic wheel on the right is the page's one light source. It sits a fixed distance from
// the top (light-top, shared with Life Hub's sun), so it stays put whatever the header holds. The art runs behind the
// whole page, so the rays also show in the side frame on desktop. The red is lightest at the wheel
// and deepens with distance, rays fade as they travel, and every glass tile is lit from the wheel:
// rims brightest facing it, edges bending the rays behind them. When the page opens, the title slams
// in, the rays burst, the subtitle fades down and the wheel turns, then rests (shell-entrance tokens).
// Every glass surface on the page, cards included, is lit from the wheel, in light and dark mode.

export interface PageShellProps {
  /** The product name. The page's only h1. */
  title: ReactNode;
  /** One line under the title, like a greeting. */
  subtitle?: ReactNode;
  /** Navigation that sits in the header, like an ActionTileGroup. */
  navigation?: ReactNode;
  /** App-wide actions at the top right of the header, like the Settings button. */
  actions?: ReactNode;
  /** The page itself, shown on the sheet. */
  children: ReactNode;
  className?: string;
}

const Wheel = () => (
  <svg className="ds-shell__wheel" viewBox="0 0 200 200" aria-hidden="true" focusable="false" fill="none" stroke="currentColor">
    <circle cx="100" cy="100" r="96" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="84" strokeWidth="1" strokeDasharray="3 5" />
    <circle cx="100" cy="100" r="58" strokeWidth="1.5" />
    <polygon points="100,16 173,142 27,142" strokeWidth="1" />
    <polygon points="100,184 27,58 173,58" strokeWidth="1" />
    <circle cx="100" cy="100" r="20" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="6" fill="currentColor" />
    <path strokeWidth="1.5" d="M100 4v10M100 186v10M4 100h10M186 100h10M32 32l7 7M161 161l7 7M168 32l-7 7M39 161l-7 7" />
  </svg>
);

export function PageShell({ title, subtitle, navigation, actions, children, className }: PageShellProps) {
  const shell = useRef<HTMLDivElement>(null);
  useGlassLight(shell, { source: '.ds-shell__wheel', selector: '.ds-glass' });
  // Where the header's glass tiles sit, so the rays fade behind them (shell-art-ray-behind-glass).
  useLayoutEffect(() => {
    const el = shell.current;
    if (!el) return;
    const update = () => {
      const tiles = el.querySelectorAll<HTMLElement>('.ds-shell__header .ds-tile');
      if (!tiles.length) return;
      const top = el.getBoundingClientRect().top;
      let a = Infinity;
      let b = -Infinity;
      tiles.forEach((t) => {
        const r = t.getBoundingClientRect();
        a = Math.min(a, r.top - top);
        b = Math.max(b, r.bottom - top);
      });
      el.style.setProperty('--shell-glass-top', `${a}px`);
      el.style.setProperty('--shell-glass-bottom', `${b}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={shell} className={className ? `ds-shell ${className}` : 'ds-shell'}>
      <Wheel />
      <header className="ds-shell__header">
        <div className="ds-shell__inner">
          <div className="ds-shell__top">
            <h1 className="ds-shell__title">{title}</h1>
            {actions && <div className="ds-shell__actions">{actions}</div>}
          </div>
          {subtitle && <p className="ds-shell__subtitle">{subtitle}</p>}
          {navigation && <div className="ds-shell__nav">{navigation}</div>}
        </div>
      </header>
      <main className="ds-shell__sheet">
        <div className="ds-shell__inner">{children}</div>
      </main>
    </div>
  );
}
