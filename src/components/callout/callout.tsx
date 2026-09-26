import type { HTMLAttributes, ReactNode } from 'react';
import '../shared.css';
import './callout.css';

// Mirrors the Figma "Callout" set: tone (info, due, settled, overdue, quiet) and title (true, false).
export type CalloutTone = 'info' | 'due' | 'settled' | 'overdue' | 'quiet';

// Each tone has a shape and a word, so color is never the only signal.
const TONE: Record<CalloutTone, { glyph: string; label: string }> = {
  info: { glyph: 'i', label: 'Info' },
  due: { glyph: '!', label: 'Due soon' },
  settled: { glyph: '✓', label: 'Done' },
  overdue: { glyph: '!', label: 'Overdue' },
  quiet: { glyph: '·', label: 'Note' },
};

export interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: CalloutTone;
  /** Optional bold first line. */
  title?: ReactNode;
  /** Word read out by screen readers before the message. Defaults to the tone's name. */
  toneLabel?: string;
  children: ReactNode;
}

export function Callout({ tone = 'info', title, toneLabel, className, children, ...rest }: CalloutProps) {
  const t = TONE[tone];
  const classes = ['ds-callout', `ds-callout--${tone}`];
  if (className) classes.push(className);
  return (
    <div className={classes.join(' ')} {...rest}>
      <span className="ds-callout__icon" aria-hidden="true">
        {t.glyph}
      </span>
      <div className="ds-callout__content">
        {title && (
          <p className="ds-callout__title">
            <span className="ds-visually-hidden">{toneLabel ?? t.label}: </span>
            {title}
          </p>
        )}
        <p className="ds-callout__body">
          {!title && <span className="ds-visually-hidden">{toneLabel ?? t.label}: </span>}
          {children}
        </p>
      </div>
    </div>
  );
}
