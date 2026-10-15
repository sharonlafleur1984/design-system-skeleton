import { useContext, useMemo, useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import '../material.css';
import '../glass.css';
import '../glass-lens/glass-lens.css';
import '../action-tile/action-tile.css';
import './card.css';
import { useGlassLight } from '../glass-light/glass-light';
import { clearArt } from '../glass-lens/lens-art';
import { AppearanceContext, LitContext, lensClass, resolveAppearance, type Appearance, type Material } from '../material';

// Card (rebuilt Oct 15): the action tile's look, for any content. Solid or Glass, with the tile's
// label, title and description in the theme's type styles. One look shared with Action tile: the
// surface, states and type all come from action-tile.css, so the two never drift apart.
// - A card that holds content is a plain box (pick the element with `as`).
// - With href it goes to a page (React Aria Link); with onPress it does something (React Aria Button).
//   Then the whole card is one click target: never put a button or link inside it.

/** @deprecated The old emphasis levels. Cards are Solid or Glass now (appearance). */
export type CardVariant = 'transparent' | 'translucent' | 'opaque';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Solid (the default) or Glass. Glass is clear: its edge, highlight and shadow come from the page's light, and on artwork the design system paints it bends the art at its edges. */
  appearance?: Appearance;
  /** Optional. Small line above the title, like "Next up". */
  label?: ReactNode;
  /** The card's name, in the theme's heading style. */
  title?: ReactNode;
  /** Optional. A short line under the title. */
  description?: ReactNode;
  /** Goes to this page: the whole card is a link. */
  href?: string;
  /** Does this when pressed: the whole card is a button. */
  onPress?: () => void;
  /** For a card that's a link or button. */
  isDisabled?: boolean;
  /** The HTML element for a card that holds content, for example "section" or "article". */
  as?: ElementType;
  /** Anything else the card holds, under the title and description, like buttons on a content card. */
  children?: ReactNode;
  /** Storybook only: forces a look for the state gallery. */
  'data-state'?: 'hover' | 'focus' | 'pressed';
  /** @deprecated Use appearance: "default" is now "solid". */
  material?: Material;
  /** @deprecated Ignored. Cards are Solid or Glass now. */
  variant?: CardVariant;
  /** @deprecated Ignored. Give the card href or onPress to make it pressable. */
  interactive?: boolean;
}

export function Card({ appearance: own, material, label, title, description, href, onPress, isDisabled, as: Tag = 'div', className, children, variant: _variant, interactive: _interactive, ...rest }: CardProps) {
  const container = useContext(AppearanceContext);
  const appearance = resolveAppearance(own, material) ?? container ?? 'solid';
  const glass = appearance === 'glass';
  const pressable = href !== undefined || onPress !== undefined;
  const classes = ['ds-tile', 'ds-glass', 'ds-card', glass ? 'ds-tile--glass' : null, lensClass(appearance), pressable ? null : 'ds-card--static', className].filter(Boolean).join(' ');
  const body = (
    <>
      <span className="ds-tile__glass" aria-hidden="true" />
      {label && <span className="ds-tile__label">{label}</span>}
      {title && <span className="ds-tile__title">{title}</span>}
      {description && <span className="ds-tile__description">{description}</span>}
      {children && <div className="ds-card__body">{children}</div>}
    </>
  );
  const state = rest['data-state'];
  const card = href !== undefined ? (
    <AriaLink href={href} isDisabled={isDisabled} className={classes} data-state={state}>
      {body}
    </AriaLink>
  ) : onPress !== undefined ? (
    <AriaButton onPress={onPress} isDisabled={isDisabled} className={classes} data-state={state}>
      {body}
    </AriaButton>
  ) : (
    <Tag className={classes} {...rest}>
      {body}
    </Tag>
  );
  return glass ? <GlassFrame>{card}</GlassFrame> : card;
}

/**
 * Lights a Glass card that isn't inside a container that lights its own glass (a page with its art, the
 * page shell header). The glass is clear and the lens draws only its light, from the page's light.
 */
function GlassFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const litContainer = useContext(LitContext);
  const inShell = useContext(AppearanceContext) !== null;
  const lit = litContainer || inShell;
  const lens = useMemo(() => (lit ? false : { art: clearArt(), selector: '.ds-card.ds-lens' }), [lit]);
  useGlassLight(ref, { selector: lit ? ':not(*)' : '.ds-card', lens, reach: 6 });
  if (lit) return <>{children}</>;
  return (
    <div ref={ref} className="ds-card-frame">
      {children}
    </div>
  );
}
