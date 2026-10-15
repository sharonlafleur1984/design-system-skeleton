import type { ReactNode } from 'react';
import { Primary, Stories, Title, useOf } from '@storybook/addon-docs/blocks';
import { DocsThemePicker } from './theme-picker';
import './component-page.css';

// Storybook only: the one layout every component's Docs tab uses (Sharon's template, Oct 15).
// A stories file fills it by setting parameters.componentPage; the page itself never changes per
// component, so every page reads the same way:
// updated date, name, what it does, React Aria part and status, the theme picker, Try it, When to use,
// Examples (the stories), Do and don't, Accessibility, For engineers, Related.

export type Status = 'ready' | 'review' | 'experimental';

export interface ComponentPageInfo {
  /** The day the page was last checked, as YYYY-MM-DD. */
  updated: string;
  /** What it does, in one line that starts with a verb. */
  summary: string;
  /** The React Aria component it's built on, if any. */
  reactAria?: { name: string; href: string };
  status: Status;
  /** What to use it for: the job it does best, then a second one if there is one. */
  useFor: ReactNode[];
  /** What to use something else for, naming the other component. */
  useElse: ReactNode[];
  do: { example: ReactNode; text: ReactNode };
  dont: { example: ReactNode; text: ReactNode };
  /** Keys that work on it, and what each does. */
  keys: { keys: string[]; does: string }[];
  /** What a screen reader says, in the pattern and an example. */
  screenReader: { pattern: string; example: string };
  /** Anything about accessibility that's different for this component. */
  accessibility?: ReactNode[];
  /** The names to import. */
  imports: string[];
  /** The tokens it uses, with [part] or [state] where there's one per part or state. */
  tokens: string[];
  related: { name: string; href: string }[];
}

const statusName: Record<Status, string> = { ready: 'Ready', review: 'In review', experimental: 'Experimental' };

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// The checks every component passes. The a11y addon and tests/a11y check them on every story.
const standardChecks = [
  'Text contrast at least 4.5:1, in every theme and mode',
  'Touch target at least 24 by 24px',
  'Focus ring always visible',
  'Works with Reduce motion',
];

type ArgType = { name?: string; description?: string; options?: unknown[]; table?: { type?: { summary?: string }; defaultValue?: { summary?: string }; disable?: boolean } };

/** The props, from the component's own types and comments. */
function PropTable() {
  const { preparedMeta } = useOf('meta', ['meta']);
  const rows = Object.entries(preparedMeta.argTypes as Record<string, ArgType>).filter(([, a]) => !a.table?.disable && a.description && !/@deprecated|^Deprecated/i.test(a.description));
  if (!rows.length) return null;
  return (
    <div className="sb-page__frame">
      <table className="sb-page__table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, a]) => (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>
                <code>{a.options && a.table?.type?.summary === 'union' ? a.options.map((o) => (typeof o === 'string' ? `'${o}'` : String(o))).join(' | ') : (a.table?.type?.summary ?? '')}</code>
              </td>
              <td>
                <code>{a.table?.defaultValue?.summary ?? 'none'}</code>
              </td>
              <td>{a.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A link to another page in this Storybook. Docs pages sit in a frame, so the link opens in the whole window. */
export function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_top">
      {children}
    </a>
  );
}

/** The Docs page of a component, from its title ("Components/Icon tile"). */
export const docsPath = (title: string) => `/?path=/docs/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}--docs`;

const Kbd = ({ children }: { children: string }) => <kbd className="sb-page__kbd">{children}</kbd>;

export function ComponentPage({ info, name }: { info: ComponentPageInfo; name: string }) {
  return (
    <div className="sb-page sb-unstyled">
      <p className="sb-page__updated">Updated {formatDate(info.updated)}</p>
      <Title />
      <p className="sb-page__summary">{info.summary}</p>
      <p className="sb-page__built">
        {info.reactAria && (
          <span>
            Built on React Aria <a href={info.reactAria.href} target="_blank" rel="noreferrer">{info.reactAria.name}</a>
          </span>
        )}
        <span className={`sb-page__status sb-page__status--${info.status}`}>
          <span aria-hidden="true" className="sb-page__dot" />
          {statusName[info.status]}
        </span>
      </p>
      <DocsThemePicker />

      <h2 className="sb-page__h2">Try it</h2>
      <p className="sb-page__lead">Change the settings in the Controls tab at the bottom of the page to see all available interactions.</p>
      <Primary />

      <h2 className="sb-page__h2">When to use {name}</h2>
      <div className="sb-page__pair">
        <section className="sb-page__card">
          <h3 className="sb-page__h3">Use it for</h3>
          <ul>
            {info.useFor.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </section>
        <section className="sb-page__card">
          <h3 className="sb-page__h3">Use something else for</h3>
          <ul>
            {info.useElse.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </section>
      </div>

      <h2 className="sb-page__h2">Examples</h2>
      <p className="sb-page__lead">One story for each variant or state. Each gets a heading, one line and its code.</p>
      <Stories title="" includePrimary={false} />

      <h2 className="sb-page__h2">Do and don&apos;t</h2>
      <div className="sb-page__pair">
        {(['do', 'dont'] as const).map((kind) => (
          <section key={kind} className={`sb-page__rule sb-page__rule--${kind}`}>
            <div className="sb-page__example">{info[kind].example}</div>
            <div className="sb-page__rule-text">
              <p className="sb-page__verdict">
                <span aria-hidden="true">{kind === 'do' ? '✓' : '✕'}</span> {kind === 'do' ? 'Do' : "Don't"}
              </p>
              <p>{info[kind].text}</p>
            </div>
          </section>
        ))}
      </div>

      <h2 className="sb-page__h2">Accessibility</h2>
      <p className="sb-page__lead">What a screen reader says, and which keys work. The Accessibility tab under each story runs the same checks.</p>
      <div className="sb-page__pair">
        <div className="sb-page__frame">
          <table className="sb-page__table">
            <thead>
              <tr>
                <th>Key</th>
                <th>What happens</th>
              </tr>
            </thead>
            <tbody>
              {info.keys.map((k) => (
                <tr key={k.keys.join()}>
                  <td>
                    {k.keys.map((key, i) => (
                      <span key={key}>
                        {i > 0 && ' or '}
                        <Kbd>{key}</Kbd>
                      </span>
                    ))}
                  </td>
                  <td>{k.does}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <section className="sb-page__card">
          <h3 className="sb-page__h3">A screen reader says</h3>
          <p className="sb-page__says">&quot;{info.screenReader.pattern}&quot;</p>
          <p className="sb-page__muted">Example: &quot;{info.screenReader.example}&quot;</p>
        </section>
      </div>
      <ul className="sb-page__checks">
        {standardChecks.map((c) => (
          <li key={c}>
            <span className="sb-page__pass">Pass</span> {c}
          </li>
        ))}
      </ul>
      {info.accessibility?.map((a, i) => (
        <p key={i} className="sb-page__note">
          {a}
        </p>
      ))}

      <details className="sb-page__engineers">
        <summary>For engineers: props, tokens and import</summary>
        <pre className="sb-page__import">
          <code>{`import { ${info.imports.join(', ')} } from 'design-system-skeleton';`}</code>
        </pre>
        <PropTable />
        <p className="sb-page__tokens">
          <span>Tokens it uses</span>
          {info.tokens.map((t) => (
            <code key={t}>{t}</code>
          ))}
        </p>
      </details>

      <h2 className="sb-page__h2">Related</h2>
      <p className="sb-page__related">
        {info.related.map((r) => (
          <DocLink key={r.href} href={r.href}>
            {r.name}
          </DocLink>
        ))}
      </p>
    </div>
  );
}

/** The Docs page for any stories file: the component template when it has one, otherwise the plain page. */
export function useComponentPage() {
  const { preparedMeta } = useOf('meta', ['meta']);
  const info = preparedMeta.parameters.componentPage as ComponentPageInfo | undefined;
  const name = preparedMeta.title.split('/').at(-1) ?? '';
  return info ? { info, name } : null;
}
