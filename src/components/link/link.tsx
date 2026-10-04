import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import '../shared.css';
import './link.css';

// Two link levels, shared by every product (tokens/base/link.json). Each theme sets the colors.
export type LinkLevel = 'inline' | 'quiet';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** inline: a link inside a sentence, at the sentence's size. quiet: a side trip, one step smaller and gray. */
  level?: LinkLevel;
  /** Opens another site in a new tab, with a marker and a hidden "(opens in a new tab)". */
  external?: boolean;
  children: ReactNode;
}

const classes = (level: LinkLevel, className?: string) =>
  ['ds-link', `ds-link--${level}`, className].filter(Boolean).join(' ');

/** Goes somewhere: another page, another place on this page, or another site. */
export function Link({ level = 'inline', external = false, className, children, ...rest }: LinkProps) {
  const outside = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a className={classes(level, className)} {...outside} {...rest}>
      {children}
      {external && (
        <>
          <svg className="ds-link__external" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M6 3h7v7M13 3 4 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="ds-visually-hidden"> (opens in a new tab)</span>
        </>
      )}
    </a>
  );
}

export interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  level?: LinkLevel;
  children: ReactNode;
}

/**
 * Does something on this page (Show full year, Restore all) but looks like a link.
 * It's a real button, so keyboards and screen readers treat it as an action.
 */
export function LinkButton({ level = 'quiet', type = 'button', className, children, ...rest }: LinkButtonProps) {
  return (
    <button type={type} className={classes(level, className)} {...rest}>
      {children}
    </button>
  );
}
