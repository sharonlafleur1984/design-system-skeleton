import type { ReactNode } from 'react';
import './page-shell.css';

// After Graduation's page shell (Decisions, Oct 4): the header runs edge to edge and the page is a
// sheet that rises over its bottom edge. On desktop the sheet sits in from the screen sides so the
// header's red frames the page. All spacing comes from the layout and shell tokens, which change by
// screen size on their own.

export interface PageShellProps {
  /** The product name. The page's only h1. */
  title: ReactNode;
  /** One line under the title, like a greeting. */
  subtitle?: ReactNode;
  /** Navigation that sits in the header, like EpisodeTabList. */
  navigation?: ReactNode;
  /** The page itself, shown on the sheet. */
  children: ReactNode;
  className?: string;
}

export function PageShell({ title, subtitle, navigation, children, className }: PageShellProps) {
  return (
    <div className={className ? `ds-shell ${className}` : 'ds-shell'}>
      <header className="ds-shell__header">
        <div className="ds-shell__inner">
          <h1 className="ds-shell__title">{title}</h1>
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
