// The two looks a glass component can have (Oct 14). Glass only shows on artwork the design system
// controls (a theme's header art, Life Hub's marble); on a plain page both look the same.
// - default: the subtle frosted look (the shared recipe in glass.css).
// - glass: the art behind bends at the edge, drawn by one canvas per group (glass-lens/lens.ts).
// The glass build is due for a review (issue #60).
export type Material = 'default' | 'glass';

/** The class that opts an element into the glass canvas. */
export const materialClass = (material: Material) => (material === 'glass' ? 'ds-lens' : null);
