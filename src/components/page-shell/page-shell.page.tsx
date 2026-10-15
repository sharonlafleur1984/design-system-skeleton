import type { ReactNode } from 'react';
import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { Button } from '../button/button';
import { PageShell } from './page-shell';

// The shell fills the screen's height, so the examples show only its top: the header and the start of the sheet.
// Its tokens live in Spotlight's theme only, so the examples always show Spotlight.
const Peek = ({ children }: { children: ReactNode }) => (
  <div data-theme="after-graduation" style={{ inlineSize: '100%', blockSize: '16rem', overflow: 'hidden' }}>
    {children}
  </div>
);

// Storybook only: what Page shell's Docs page says (the component page template).
export const pageShellPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Frames every page: a header that runs edge to edge, and the page as a sheet rising over its bottom edge.',
  status: 'ready',
  useFor: [
    'Once per app, around every page: the title, app-wide actions and navigation in the header, the page on the sheet.',
    'Switching between a few main pages: pass action tiles as navigation. On phones they become the bottom bar.',
  ],
  useElse: [
    <>
      Switching views inside one page: use <DocLink href={docsPath('Components/Tabs')}>Tabs</DocLink>.
    </>,
    <>
      A box of related content on the page: use <DocLink href={docsPath('Components/Card')}>Card</DocLink>.
    </>,
    <>
      App-wide settings: open <DocLink href={docsPath('Patterns/Settings')}>Settings</DocLink> from a button in the shell&apos;s actions.
    </>,
  ],
  do: {
    example: (
      <Peek>
        <PageShell title="Page title" actions={<Button appearance="glass" size="small">Settings</Button>}>
          <p style={{ margin: 0 }}>Page content</p>
        </PageShell>
      </Peek>
    ),
    text: 'App-wide actions, like Settings, go in actions at the top right, where people look for them.',
  },
  dont: {
    example: (
      <Peek>
        <PageShell title="Page title">
          <Button variant="secondary" size="small">Settings</Button>
        </PageShell>
      </Peek>
    ),
    text: 'App-wide actions on the sheet, where they read as settings for that one page.',
  },
  keys: [{ keys: ['Tab'], does: "Moves through the header's actions and navigation, then the page. The shell itself isn't interactive." }],
  screenReader: { pattern: '[Title], heading level 1', example: 'Page title, heading level 1' },
  accessibility: [
    "The title is the page's only h1. The header is a banner landmark and the sheet is main, so people can jump between them.",
    'The wheel turns as the page opens, then comes to rest within 30 seconds (WCAG 2.2.2). Reduce motion only fades.',
    'Glass in the header turns frosted without WebGL or with Reduce transparency.',
  ],
  imports: ['PageShell'],
  tokens: ['--layout-[part]', '--shell-sheet-[part]', '--shell-art-[part]', '--shell-entrance-[part]', '--light-top', '--radius-panel'],
  related: [
    { name: 'Action tile', href: docsPath('Components/Action tile') },
    { name: 'Settings', href: docsPath('Patterns/Settings') },
    { name: 'Glass', href: '/?path=/story/foundations-glass--playground' },
  ],
};
