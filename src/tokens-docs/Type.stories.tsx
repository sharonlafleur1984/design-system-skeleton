import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = { title: 'Foundations/Type' };
export default meta;

// Realistic sample copy for each role, so problems with numbers, long words and wrapping show up.
const roles: [string, string][] = [
  ['display-cover', 'Every journey starts with a direction'],
  ['display-xl', 'Senior year: 4 of 12 done'],
  ['display-l', 'Your next step'],
  ['display-m', 'Applications due before March 1'],
  ['heading-title', 'Compare your top 3 schools'],
  ['heading-heading', 'Money: what State U really costs'],
  ['heading-subheading', 'Scholarships you can still apply for'],
  ['body-large', 'File the FAFSA (the federal aid form) early. Some aid is first come, first served.'],
  ['body-default', 'State U costs about $4,200 a year more than your aid covers. Here are 3 scholarships that could close the gap.'],
  ['body-small', 'Last updated Oct 3, 2026'],
  ['body-micro', 'Estimate, based on last year’s tuition'],
  ['label-caps', 'Next step'],
  ['label-banner', 'New'],
  ['data-default', '$4,200 a year'],
  ['data-small', '3.6 GPA · 1280 SAT'],
  ['data-micro', 'Due 2027-03-01'],
];

/** Shows the real size and line height the browser uses, so the label matches what you see. */
function Spec({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const [spec, setSpec] = useState('');
  useEffect(() => {
    const update = () => {
      if (!target.current) return;
      const s = getComputedStyle(target.current);
      const size = parseFloat(s.fontSize);
      const lh = parseFloat(s.lineHeight);
      const font = s.fontFamily.split(',')[0].replace(/['"]/g, '');
      setSpec(`${Math.round(size)}px / ${isNaN(lh) ? s.lineHeight : (lh / size).toFixed(2)} · ${s.fontWeight} · ${font}`);
    };
    update();
    window.addEventListener('resize', update);
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, [target]);
  return <span>{spec}</span>;
}

function Row({ role, text }: { role: string; text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isDisplay = role.startsWith('display');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-4)', alignItems: 'first baseline' }}>
      <div style={{ flex: '0 0 190px', display: 'grid', gap: 'var(--space-1)', fontFamily: 'var(--font-family-body)', fontSize: 'var(--type-body-small-size)', color: 'var(--color-ink-tertiary)' }}>
        <code style={{ color: 'var(--color-ink-secondary)' }}>{role}</code>
        <Spec target={ref} />
      </div>
      <p
        ref={ref}
        style={{
          flex: '1 1 260px',
          margin: 0,
          maxInlineSize: isDisplay ? '20ch' : '65ch',
          textWrap: isDisplay ? 'balance' : 'pretty',
          fontFamily: `var(--type-${role}-family)`,
          fontSize: `var(--type-${role}-size)`,
          lineHeight: `var(--type-${role}-line-height)`,
          letterSpacing: `var(--type-${role}-letter-spacing)`,
          fontWeight: `var(--type-${role}-weight)` as never,
          textTransform: role.startsWith('label') ? 'uppercase' : undefined,
        }}
      >
        {text}
      </p>
    </div>
  );
}

/**
 * The type scale. Every product shares the same role names; each theme sets its own fonts and, where the font
 * needs it, its own sizes. Display text keeps lines short (about 20 characters) and balances line breaks.
 */
export const Scale: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      {roles.map(([role, text]) => (
        <Row key={role} role={role} text={text} />
      ))}
    </div>
  ),
};
