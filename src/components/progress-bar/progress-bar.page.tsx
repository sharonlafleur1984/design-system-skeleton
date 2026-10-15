import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { ProgressBar } from './progress-bar';

const wide = { inlineSize: '100%' } as const;

// Storybook only: what Progress bar's Docs page says (the component page template).
export const progressBarPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Shows how much of something is done.',
  reactAria: { name: 'ProgressBar', href: 'https://react-aria.adobe.com/ProgressBar' },
  status: 'ready',
  useFor: ['Progress toward a clear finish line, like a checklist.'],
  useElse: [
    'Loading: a progress bar is for progress people make, not waiting.',
    <>
      A single yes or no: use <DocLink href={docsPath('Components/Checkbox')}>Checkbox</DocLink>.
    </>,
  ],
  do: {
    example: (
      <div style={wide}>
        <ProgressBar value={3} max={5} label="Steps done" showLabel />
      </div>
    ),
    text: 'Say what is being measured, with the label and value above the bar.',
  },
  dont: {
    example: (
      <div style={wide}>
        <ProgressBar value={3} max={5} label="Steps done" />
      </div>
    ),
    text: 'A bar with no label anywhere nearby.',
  },
  keys: [{ keys: ['Tab'], does: "Skips it: it isn't interactive" }],
  screenReader: { pattern: '[Label], progress bar, [value]', example: 'Steps done, progress bar, 3 of 5' },
  accessibility: [
    'The label is always read by screen readers, even when showLabel is off.',
    'The spoken value is "3 of 5", or a percentage when the finish line is 100.',
  ],
  imports: ['ProgressBar'],
  tokens: ['--control-meter', '--radius-control', '--color-surface-sunken', '--color-accent-base', '--font-family-data', '--motion-duration-slow'],
  related: [
    { name: 'Checkbox', href: docsPath('Components/Checkbox') },
    { name: 'Card', href: docsPath('Components/Card') },
    { name: 'Motion', href: docsPath('Foundations/Motion') },
  ],
};
