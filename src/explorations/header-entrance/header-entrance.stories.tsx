import type { Meta, StoryObj } from '@storybook/react-vite';
import { useContext, useState } from 'react';
import { ThemeContext } from '../../components/story-helpers';
import { Button } from '../../components/button/button';
import './header-entrance.css';

const meta: Meta = {
  title: 'Explorations/After Graduation header entrance',
  parameters: {
    docs: {
      description: {
        component:
          'Exploration, not in the library yet. The header animation from the prototype, rebuilt with tokens and slowed to about 1.4 times its old speed. ' +
          'Timing lives in the --shell-entrance-* tokens. After Graduation only.',
      },
    },
  },
};
export default meta;

const Circle = () => (
  <svg className="ag-header__circle" viewBox="0 0 200 200" aria-hidden="true" fill="none" stroke="currentColor">
    <circle cx="100" cy="100" r="96" strokeWidth="2" />
    <circle cx="100" cy="100" r="84" strokeWidth="1" strokeDasharray="3 5" />
    <circle cx="100" cy="100" r="58" strokeWidth="2" />
    <polygon points="100,16 173,142 27,142" strokeWidth="1.5" />
    <polygon points="100,184 27,58 173,58" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="20" strokeWidth="2" />
    <circle cx="100" cy="100" r="6" fill="currentColor" />
    <path strokeWidth="2" d="M100 4v10M100 186v10M4 100h10M186 100h10M32 32l7 7M161 161l7 7M168 32l-7 7M39 161l-7 7" />
  </svg>
);

/** Plays when the page opens. Press Replay to watch it again. With reduced motion on, it only fades. */
export const Entrance: StoryObj = {
  render: function Entrance() {
    const [run, setRun] = useState(0);
    if (useContext(ThemeContext) === 'life-hub') return <p>After Graduation only. Switch the theme in the toolbar to see it.</p>;
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <header key={run} className="ag-header">
          <Circle />
          <h1 className="ag-header__title">After Graduation</h1>
          <p className="ag-header__subtitle">Get ready for Season 2</p>
        </header>
        <div><Button variant="secondary" size="small" onPress={() => setRun((r) => r + 1)}>Replay</Button></div>
      </div>
    );
  },
};
