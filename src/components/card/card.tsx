import { useContext, useMemo, useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import '../material.css';
import '../glass.css';
import '../glass-lens/glass-lens.css';
import '../action-tile/action-tile.css';
import '../text/text.css';
import './card.css';
import { useGlassLight } from '../glass-light/glass-light';
import { clearArt } from '../glass-lens/lens-art';
import { AppearanceContext, LitContext, lensClass, resolveAppearance, type Appearance, type Material } from '../material';
import { TileHeader, type TileHeaderOptions } from '../tile-header';

// Card (Oct 15): a surface. Solid or Glass, with the action tile's look, and nothing on it until you
// add parts: CardHeader (an optional icon, a label and a title), CardBody (the main content) and
// CardFooter (buttons, or a quiet note). Each part has its type already chosen from the theme.
// A card is never pressable itself; the buttons and links on it are. For a whole tile that's a link
// or button, use Tile. Card, Tile and Action tile share one stylesheet (action-tile.css).

/** @deprecated The old emphasis levels. Cards are Solid or Glass now (appearance). */
export type CardVariant = 'transparent' | 'translucent' | 'opaque';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Solid (the default) or Glass. Glass is clear: its edge, highlight and shadow come from the page's light, and on artwork the design system paints it bends the art at its edges. */
  appearance?: Appearance;
  /** The HTML element, for example "section" or "article". */
  as?: ElementType;
  /** The card's parts: CardHeader, CardBody and CardFooter, or anything else. */
  children?: ReactNode;
  /** @deprecated Use appearance: "default" is now "solid". */
  material?: Material;
  /** @deprecated Ignored. Cards are Solid or Glass now. */
  variant?: CardVariant;
  /** @deprecated Ignored. A card is never pressable; use Tile for one that is. */
  interactive?: boolean;
}

export function Card({ appearance: own, material, as: Tag = 'div', className, children, variant: _variant, interactive: _interactive, ...rest }: CardProps) {
  const container = useContext(AppearanceContext);
  const appearance = resolveAppearance(own, material) ?? container ?? 'solid';
  const glass = appearance === 'glass';
  const classes = ['ds-tile', 'ds-glass', 'ds-card', glass ? 'ds-tile--glass' : null, lensClass(appearance), className].filter(Boolean).join(' ');
  const card = (
    <Tag className={classes} {...rest}>
      <span className="ds-tile__glass" aria-hidden="true" />
      {children}
    </Tag>
  );
  return glass ? <GlassFrame selector=".ds-card">{card}</GlassFrame> : card;
}

export interface CardHeaderProps extends TileHeaderOptions {
  /** The card's name, in the theme's title style. */
  title: ReactNode;
  /** Its rank in the page outline: h2 to h6 (h3 by default). The look stays the same. */
  level?: 2 | 3 | 4 | 5 | 6;
}

/** The top of a card: an optional icon, a label and the card's title. */
export function CardHeader({ level = 3, ...rest }: CardHeaderProps) {
  return (
    <div className="ds-card__header">
      <TileHeader level={level} {...rest} />
    </div>
  );
}

/** The main content: running text in the body style, or anything else (a list, a chart). */
export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={['ds-card__body', 'ds-text--body-default', className].filter(Boolean).join(' ')}>{children}</div>;
}

/** The bottom of a card: buttons, and an optional quiet note like "Updated 2 hours ago". */
export function CardFooter({ note, className, children }: { note?: ReactNode; className?: string; children?: ReactNode }) {
  return (
    <div className={['ds-card__footer', className].filter(Boolean).join(' ')}>
      {children && <div className="ds-card__actions">{children}</div>}
      {note && <p className="ds-text ds-text--note ds-card__note">{note}</p>}
    </div>
  );
}

/**
 * Lights Glass that isn't inside a container that lights its own glass (a page with its art, the page
 * shell header). The glass is clear and the lens draws only its light, from the page's light.
 */
export function GlassFrame({ selector, children }: { selector: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const litContainer = useContext(LitContext);
  const inShell = useContext(AppearanceContext) !== null;
  const lit = litContainer || inShell;
  const lens = useMemo(() => (lit ? false : { art: clearArt(), selector: `${selector}.ds-lens` }), [lit, selector]);
  useGlassLight(ref, { selector: lit ? ':not(*)' : selector, lens, reach: 6 });
  if (lit) return <>{children}</>;
  return (
    <div ref={ref} className="ds-card-frame">
      {children}
    </div>
  );
}
