import type { HTMLAttributes, ReactNode } from 'react';
import '../shared.css';
import '../material.css';
import '../glass.css';
import './callout.css';
import { materialClass, type Material } from '../material';

// Mirrors the Figma "Callout" set: tone and title (true, false). The tones use the same names as the
// status colors every theme defines: info, warning, success, error and neutral.
export type CalloutTone = 'info' | 'warning' | 'success' | 'error' | 'neutral';
/** @deprecated The old tone names. due is warning, settled is success, overdue is error, quiet is neutral. */
export type LegacyCalloutTone = 'due' | 'settled' | 'overdue' | 'quiet';
const LEGACY: Record<LegacyCalloutTone, CalloutTone> = { due: 'warning', settled: 'success', overdue: 'error', quiet: 'neutral' };

// Each tone has its own glyph and a word, so color is never the only signal.
const TONE: Record<CalloutTone, { glyph: string; label: string }> = {
  info: { glyph: 'i', label: 'Info' },
  warning: { glyph: '!', label: 'Warning' },
  success: { glyph: '✓', label: 'Success' },
  error: { glyph: '×', label: 'Error' },
  neutral: { glyph: '·', label: 'Note' },
};

export interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: CalloutTone | LegacyCalloutTone;
  /** Optional bold first line. */
  title?: ReactNode;
  /** Word read out by screen readers before the message. Defaults to the tone's name. */
  toneLabel?: string;
  /**
   * Default is solid. Glass is for a callout on artwork the design system controls (a theme's header art,
   * Life Hub's marble): the art bends at its edge and its tone tints the glass. Its frosted fill keeps the
   * text as easy to read as on the solid one.
   */
  material?: Material;
  children: ReactNode;
}

export function Callout({ tone: toneProp = 'info', title, toneLabel, material = 'default', className, children, ...rest }: CalloutProps) {
  const tone = toneProp in LEGACY ? LEGACY[toneProp as LegacyCalloutTone] : (toneProp as CalloutTone);
  const t = TONE[tone];
  const classes = ['ds-callout', `ds-callout--${tone}`];
  const lens = materialClass(material);
  if (lens) classes.push('ds-callout--glass', 'ds-glass', lens);
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
