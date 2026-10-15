import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Button } from '../button/button';
import { Callout } from './callout';

const stack = { display: 'grid', gap: 'var(--space-3)', inlineSize: '100%' } as const;

// Storybook only: what Callout's page says (the component page template).
export const calloutPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Shows a short message inside a page, tinted by what it means.',
  status: 'ready',
  builtWith: { source: 'src/components/callout/callout.tsx' },
  useFor: ['A short message about the page: good to know, needs attention soon, done or something went wrong.', 'A side note that should stand out from the text around it: Neutral.'],
  useElse: [
    { job: 'An error about one form field. Show the message next to the field.' },
    { job: 'A message that needs a decision. Use a dialog.' },
    { job: 'Turning a setting on or off', instead: { name: 'Switch', title: 'Components/Switch' } },
  ],
  do: {
    example: (
      <div style={stack}>
        <Callout tone="error" title="Error">
          Description
        </Callout>
        <div>
          <Button variant="secondary">Try again</Button>
        </div>
      </div>
    ),
    rules: ['One callout that leads with the fact, then the next step.'],
  },
  dont: {
    example: (
      <div style={stack}>
        <Callout tone="info" title="Info">Description</Callout>
        <Callout tone="warning" title="Warning">Description</Callout>
        <Callout tone="error" title="Error">Description</Callout>
      </div>
    ),
    rules: ['Several callouts stacked together.', 'Pick the most important one.'],
  },
  keys: [{ keys: ['Tab'], result: "Skips it: it isn't interactive." }],
  screenReader: { pattern: '[Tone]: [Title], [Description]', example: 'Error: Error, Description' },
  accessibility: [
    'Each tone has its own symbol and a hidden word, like "Error:", read before the message, so color is never the only signal.',
    'Change the hidden word with toneLabel when the tone name doesn\'t fit the message.',
  ],
  imports: ['Callout'],
  tokens: ['--color-status-[tone]-accent-strong', '--color-surface-card', '--callout-padding-inline', '--callout-icon', '--radius-surface', '--shadow-rest'],
  related: [
    { name: 'Status colors', title: 'Foundations/Colors', story: 'status' },
    { name: 'Button', title: 'Components/Button' },
    { name: 'Card', title: 'Components/Card' },
  ],
};
