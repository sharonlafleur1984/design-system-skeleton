import { createContext } from 'react';

// The two appearances a component can have (Oct 15): Solid and Glass, named the way most design
// systems name a look (Atlassian and Fluent call it appearance).
// - solid: the component's normal surface.
// - glass: clear glass, drawn by the lens (glass-lens/lens.ts): its edge, highlight and shadow come from
//   the page's light, and on artwork the design system paints it bends the art at its edges.
// The glass build is due for a review (issue #60).
export type Appearance = 'solid' | 'glass';

/** @deprecated Use Appearance: "default" is now "solid". */
export type Material = 'default' | 'glass';

/** A component's appearance from its appearance prop, or from the old material prop. Undefined when neither is set. */
export const resolveAppearance = (appearance?: Appearance, material?: Material): Appearance | undefined =>
  appearance ?? (material === undefined ? undefined : material === 'glass' ? 'glass' : 'solid');

/** The class that opts an element into the glass canvas. */
export const lensClass = (appearance: Appearance | undefined) => (appearance === 'glass' ? 'ds-lens' : null);

/** @deprecated Use lensClass. */
export const materialClass = (material: Material) => lensClass(resolveAppearance(undefined, material));

/** A container's appearance for the components inside it, like the page shell header's tiles. A component's own appearance wins. */
export const AppearanceContext = createContext<Appearance | null>(null);

/** @deprecated Use AppearanceContext. */
export const MaterialContext = AppearanceContext;

/**
 * True inside a container that lights its own glass with the art behind it (the page shell header, a
 * page with its background art). Glass inside it doesn't light itself.
 */
export const LitContext = createContext(false);
