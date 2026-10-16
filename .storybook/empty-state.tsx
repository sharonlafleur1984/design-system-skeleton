import './empty-state.css';

/**
 * Storybook only: the empty state, wherever a part, or a theme's version of it, isn't made yet. The
 * words sit inside the dashed outline of a part still being drawn, with the pencil beside it.
 */
export function EmptyState({ title }: { title: string }) {
  return (
    <div className="sb-empty">
      <p className="sb-empty__title">{title}</p>
      <svg className="sb-empty__pencil" width="20" height="20" viewBox="110 24 22 22" fill="none" aria-hidden="true">
        <path d="M112 40 126 26l4 4-14 14-6 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M122 30l4 4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
