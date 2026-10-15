import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Link } from './link';

// Storybook only: what Link's page says (the component page template).
export const linkPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Goes somewhere: another page, another place on this page, or another site.',
  status: 'ready',
  builtWith: { reactAria: 'Link' },
  useFor: [
    'A link inside a sentence, at the sentence’s size: Inline.',
    'A side trip or a small control, like View details or a source: Quiet. If it does something on the page instead of going somewhere, use LinkButton.',
  ],
  useElse: [
    { job: 'The main action on a screen', instead: { name: 'Button', title: 'Components/Button' } },
    { job: 'Moving between views of the same page', instead: { name: 'Tabs', title: 'Components/Tabs' } },
  ],
  do: {
    example: (
      <p style={{ margin: 0 }}>
        Body text with an <Link href="#">inline link</Link>.
      </p>
    ),
    rules: ['Keep the underline.', 'It says “link” without relying on color.'],
  },
  dont: {
    example: (
      <p style={{ margin: 0 }}>
        Body text with a{' '}
        <Link href="#" style={{ fontWeight: 'var(--font-weight-bold)', textDecoration: 'none' }}>
          bold link
        </Link>
        .
      </p>
    ),
    rules: ['Make links bold, take off the underline, or add a third link level for one spot.'],
  },
  keys: [
    { keys: ['Tab'], result: 'Moves focus to it.' },
    { keys: ['Enter'], result: 'Follows the link (LinkButton also takes Space).' },
  ],
  screenReader: { pattern: '[Label], link', example: 'Read the full guide, link' },
  accessibility: [
    'Soft underline at rest, full on hover and focus, so color is never the only signal.',
    'Quiet links get a larger tap area than their text.',
    'Outside links say “(opens in a new tab)” to screen readers.',
  ],
  imports: ['Link', 'LinkButton'],
  tokens: ['--link-[level]-color', '--link-[level]-color-hover', '--link-underline-thickness', '--link-quiet-size', '--color-border-focus'],
  related: [
    { name: 'Button', title: 'Components/Button' },
    { name: 'Tabs', title: 'Components/Tabs' },
  ],
  states: {
    disabled: { isDisabled: true },
  },
};
