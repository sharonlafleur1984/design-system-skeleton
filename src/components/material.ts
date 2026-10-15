import { createContext } from 'react';

// The two looks a glass component can have (Oct 14). Glass only shows on artwork the design system
// controls (a theme's header art, Life Hub's marble); on a plain page both look the same.
// - default: the subtle frosted look (the shared recipe in glass.css).
// - glass: the art behind bends at the edge, drawn by one canvas per group (glass-lens/lens.ts).
// The glass build is due for a review (issue #60).
export type Material = 'default' | 'glass';

/** The class that opts an element into the glass canvas. */
export const materialClass = (material: Material) => (material === 'glass' ? 'ds-lens' : null);

/** A container's material for the components inside it, like the page shell header's tiles. A component's own material prop wins. */
export const MaterialContext = createContext<Material | null>(null);

/**
 * True inside a container that lights its own glass with the art behind it (the page shell header, a
 * page with its background art). Glass groups inside it don't light themselves.
 */
export const LitContext = createContext(false);
