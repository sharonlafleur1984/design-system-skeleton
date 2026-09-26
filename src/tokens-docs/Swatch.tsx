import { useEffect, useRef, useState } from 'react';

/** Turns rgb(r, g, b) into #rrggbb so values can be compared with Figma. */
const toHex = (rgb: string) => {
  const m = rgb.match(/\d+/g);
  return m && m.length >= 3 ? '#' + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, '0')).join('') : rgb;
};

type Props = { name: string };

/** One color token: a chip, its name, and its CSS variable. The value comes from the active theme. */
export function Swatch({ name }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  useEffect(() => {
    if (ref.current) setValue(toHex(getComputedStyle(ref.current).backgroundColor));
  });
  return (
    <figure style={{ margin: 0, display: 'grid', gap: 'var(--space-2)' }}>
      <div
        ref={ref}
        style={{
          height: 56,
          borderRadius: 'var(--radius-card)',
          background: `var(--${name})`,
          boxShadow: 'inset 0 0 0 1px var(--color-border-default)',
        }}
      />
      <figcaption style={{ fontSize: 'var(--type-body-small-size)', color: 'var(--color-ink-secondary)' }}>
        <code style={{ fontFamily: 'var(--font-family-data)' }}>--{name}</code>
        <br />
        <span>{value}</span>
      </figcaption>
    </figure>
  );
}

export function SwatchGroup({ title, names }: { title: string; names: string[] }) {
  return (
    <section style={{ marginBlockEnd: 'var(--space-8)' }}>
      <h2 style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--type-heading-heading-size)', fontWeight: 'var(--type-heading-heading-weight)' as never }}>
        {title}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-5)' }}>
        {names.map((n) => <Swatch key={n} name={n} />)}
      </div>
    </section>
  );
}
