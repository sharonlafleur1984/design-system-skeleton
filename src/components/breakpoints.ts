// The two screen-size breakpoints (Material 3 screen classes), as media queries. The token build uses
// the same sizes (scripts/build-tokens.mjs, BREAKPOINTS): phones (compact) are under 600px, tablets
// (medium) under 840px. CSS media queries can't read tokens, so component CSS writes these exact
// queries; tests/component-css.test.ts checks every one.
export const PHONE = '(width < 37.5rem)';
export const TABLET = '(width < 52.5rem)';
