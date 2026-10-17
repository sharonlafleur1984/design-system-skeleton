// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { ActionTile, ActionTileGroup, PageShell, Button, Card, CardHeader, CardBody, CardFooter, Tile, IconTile, Heading, Body, Label, Note, Callout, ProgressBar, Checkbox, Switch, Separator, Link, LinkButton, Tag, TagGroup, Tabs, TabList, Tab, TabPanel, ToggleButtonGroup, ToggleButton, Select, Orb, ORB_START } from '../src/components';
// The old names, kept as aliases so apps that use them keep working.
import { ProgressMeter, Divider, Chip, ChipGroup, SegmentedControl, Segment } from '../src/components';

// jsdom has no Web Animations API; React Aria's sliding selection indicator asks for it.
if (!Element.prototype.getAnimations) Element.prototype.getAnimations = () => [];
afterEach(cleanup);

// Structure and naming checks only (jsdom has no layout, so contrast is covered by the token tests).
async function expectNoAxeViolations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

describe('Button', () => {
  it('is a real button that runs its action', async () => {
    let clicks = 0;
    render(<Button onClick={() => clicks++}>Add school</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Add school' }));
    expect(clicks).toBe(1);
  });

  it('does not run while disabled or loading', async () => {
    let clicks = 0;
    render(
      <>
        <Button isDisabled onClick={() => clicks++}>Off</Button>
        <Button isPending onClick={() => clicks++}>Busy</Button>
      </>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Off' }));
    await userEvent.click(screen.getByRole('button', { name: 'Busy' }));
    expect(clicks).toBe(0);
    // React Aria marks a loading button as unavailable but keeps it focusable, and announces the change.
    const busy = screen.getByRole('button', { name: 'Busy' });
    expect(busy.getAttribute('aria-disabled')).toBe('true');
    expect(busy.hasAttribute('data-pending')).toBe(true);
    expect(busy.tabIndex).toBe(0);
  });

  it('works from the keyboard', async () => {
    let clicks = 0;
    render(<Button onPress={() => clicks++}>Add school</Button>);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(clicks).toBe(2);
  });

  it('passes data-state through for the Storybook state gallery', () => {
    render(<Button data-state="hover">Hover</Button>);
    expect(screen.getByRole('button').getAttribute('data-state')).toBe('hover');
  });

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button').getAttribute('type')).toBe('button');
  });

  it('passes an accessibility scan in every style', async () => {
    const { container } = render(
      <>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button destructive>Delete</Button>
      </>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('Card', () => {
  it('renders the element asked for, Solid by default', () => {
    render(
      <Card as="section" aria-label="This week">
        <CardHeader title="Title" />
      </Card>,
    );
    const card = screen.getByRole('region', { name: 'This week' });
    expect(card.className).not.toContain('ds-tile--glass');
    expect(screen.getByText('Title').className).toContain('ds-tile__title');
  });

  it('is Glass with appearance="glass", and still with the old material="glass"', () => {
    render(
      <>
        <Card aria-label="New">New</Card>
        <Card appearance="glass" as="section" aria-label="Glass">Glass</Card>
        <Card material="glass" as="section" aria-label="Old name">Old</Card>
      </>,
    );
    expect(screen.getByRole('region', { name: 'Glass' }).className).toContain('ds-tile--glass');
    expect(screen.getByRole('region', { name: 'Old name' }).className).toContain('ds-tile--glass');
  });

  it('is a surface with typed parts, and the title is a real heading', async () => {
    const { container } = render(
      <Card as="section" aria-label="Bills">
        <CardHeader label="Label" title="Water bill" level={2} />
        <CardBody>Due Friday.</CardBody>
        <CardFooter note="Updated today">
          <button type="button">Pay</button>
        </CardFooter>
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Water bill' })).toBeTruthy();
    expect(screen.getByText('Updated today').className).toContain('ds-text--note');
    await expectNoAxeViolations(container);
  });
});

describe('Tile', () => {
  it('is one link or one button, with its icon decorative', async () => {
    const icon = <svg viewBox="0 0 24 24" />;
    const { container } = render(
      <>
        <Tile href="#" icon={icon} title="Go somewhere" description="A page" />
        <Tile onPress={() => {}} title="Do something" />
      </>,
    );
    expect(screen.getByRole('link', { name: /Go somewhere/ }).className).toContain('ds-tile');
    expect(screen.getByRole('button', { name: /Do something/ })).toBeTruthy();
    expect(container.querySelector('.ds-icon-tile')?.getAttribute('aria-hidden')).toBe('true');
    await expectNoAxeViolations(container);
  });
});

describe('Icon tile', () => {
  it('is read out only when it has a label', () => {
    render(<IconTile icon={<svg viewBox="0 0 24 24" />} label="Calendar" size="large" variant="plain" />);
    const tile = screen.getByRole('img', { name: 'Calendar' });
    expect(tile.className).toContain('ds-icon-tile--large');
    expect(tile.className).toContain('ds-icon-tile--plain');
  });
});

describe('Text parts', () => {
  it('keep the look and the heading level separate', () => {
    render(
      <>
        <Heading level={4} variant="title">Title</Heading>
        <Body>Body</Body>
        <Label>Label</Label>
        <Note>Note</Note>
      </>,
    );
    expect(screen.getByRole('heading', { level: 4, name: 'Title' }).className).toContain('ds-text--title');
    expect(screen.getByText('Label').className).toContain('ds-text--label');
  });
});

describe('Callout', () => {
  it('says what the tone means in words, not just color', () => {
    render(<Callout tone="error" title="2 days late">Recommendation letter.</Callout>);
    expect(screen.getByText(/Error:/)).toBeTruthy();
  });

  it('passes an accessibility scan', async () => {
    const { container } = render(<Callout tone="warning">Fee due Friday.</Callout>);
    await expectNoAxeViolations(container);
  });
});

describe('ProgressBar', () => {
  it('exposes its label and value to screen readers', () => {
    render(<ProgressBar value={3} max={5} label="Checklist" />);
    const bar = screen.getByRole('progressbar', { name: 'Checklist' });
    expect(bar.getAttribute('aria-valuenow')).toBe('3');
    expect(bar.getAttribute('aria-valuetext')).toBe('3 of 5');
  });

  it('keeps the value between 0 and max', () => {
    render(<ProgressBar value={9} max={5} label="Too much" />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('5');
  });
});

describe('Checkbox', () => {
  it('reports its new value as true or false', async () => {
    let last: boolean | undefined;
    render(<Checkbox label="Done" onChange={(v) => (last = v)} />);
    await userEvent.click(screen.getByText('Done'));
    expect(last).toBe(true);
  });

  it('toggles from its label', async () => {
    render(<Checkbox label="Ask for a fee waiver" />);
    const box = screen.getByRole('checkbox', { name: 'Ask for a fee waiver' });
    await userEvent.click(screen.getByText('Ask for a fee waiver'));
    expect((box as HTMLInputElement).checked).toBe(true);
  });

  it('passes an accessibility scan', async () => {
    const { container } = render(<Checkbox label="Done" defaultSelected />);
    await expectNoAxeViolations(container);
  });
});

describe('Switch', () => {
  it('follows the switch pattern and toggles with the keyboard', async () => {
    let last: boolean | undefined;
    render(<Switch label="Email reminders" onChange={(v) => (last = v)} />);
    const sw = screen.getByRole('switch', { name: 'Email reminders' }) as HTMLInputElement;
    expect(sw.checked).toBe(false);
    sw.focus();
    await userEvent.keyboard(' ');
    expect(sw.checked).toBe(true);
    expect(last).toBe(true);
  });

  it('passes an accessibility scan', async () => {
    const { container } = render(<Switch label="Email reminders" defaultSelected />);
    await expectNoAxeViolations(container);
  });
});

describe('Separator', () => {
  it('is announced as a separator', () => {
    render(<Separator />);
    expect(screen.getByRole('separator')).toBeTruthy();
  });
});

describe('Orb', () => {
  it('is a named button that starts on the right, two thirds down', () => {
    render(<Orb position={ORB_START} onPositionChange={() => {}} />);
    const orb = screen.getByRole('button', { name: 'Light. Drag it, or use the arrow keys to move it.' });
    expect(ORB_START).toEqual({ x: 0.92, y: 0.67 });
    expect(orb.style.left).toBe('92%');
    expect(orb.style.top).toBe('67%');
  });

  it('moves with the arrow keys, farther with Shift, and stays inside its section', async () => {
    const moves: { x: number; y: number }[] = [];
    const { rerender } = render(<Orb position={{ x: 0.5, y: 0.5 }} onPositionChange={(p) => moves.push(p)} />);
    const orb = screen.getByRole('button');
    orb.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{Shift>}{ArrowUp}{/Shift}');
    expect(moves[0].x).toBeCloseTo(0.48);
    expect(moves[1].y).toBeCloseTo(0.4);
    rerender(<Orb position={{ x: 1, y: 1 }} onPositionChange={(p) => moves.push(p)} />);
    await userEvent.keyboard('{ArrowRight}');
    expect(moves[2]).toEqual({ x: 1, y: 1 });
  });

  it('keeps its own place when no position is given', async () => {
    render(<Orb />);
    const orb = screen.getByRole('button');
    orb.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(orb.style.top).toBe('65%');
  });

  it("glows in an area's color family when given one", () => {
    render(<Orb position={ORB_START} onPositionChange={() => {}} palette="seagull" />);
    expect(screen.getByRole('button').style.getPropertyValue('--orb-color-body')).toBe('var(--palette-seagull-400)');
  });

  it('is a medium glow by default, and takes a clear look and other sizes', () => {
    const { rerender } = render(<Orb />);
    expect(screen.getByRole('button').className).toContain('ds-orb--glow');
    expect(screen.getByRole('button').className).toContain('ds-orb--medium');
    rerender(<Orb look="clear" size="large" />);
    expect(screen.getByRole('button').className).toContain('ds-orb--clear');
    expect(screen.getByRole('button').className).toContain('ds-orb--large');
  });

  it('has no accessibility problems', async () => {
    const { container } = render(<Orb position={ORB_START} onPositionChange={() => {}} />);
    await expectNoAxeViolations(container);
  });
});

describe('Link', () => {
  it('is a real link with its level as a class', () => {
    render(<Link href="/dates">Important Dates</Link>);
    const a = screen.getByRole('link', { name: 'Important Dates' });
    expect(a.getAttribute('href')).toBe('/dates');
    expect(a.className).toContain('ds-link--inline');
  });

  it('quiet level', () => {
    render(<Link level="quiet" href="#">View task</Link>);
    expect(screen.getByRole('link', { name: 'View task' }).className).toContain('ds-link--quiet');
  });

  it('outside links open safely in a new tab and say so', () => {
    render(<Link href="https://studentaid.gov" external>Federal Student Aid</Link>);
    const a = screen.getByRole('link', { name: /^Federal Student Aid\s*\(opens in a new tab\)$/ });
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('LinkButton is a real button that runs its action, quiet by default', async () => {
    let clicks = 0;
    render(<LinkButton onClick={() => clicks++}>Show full year</LinkButton>);
    const b = screen.getByRole('button', { name: 'Show full year' });
    await userEvent.click(b);
    expect(clicks).toBe(1);
    expect(b.getAttribute('type')).toBe('button');
    expect(b.className).toContain('ds-link--quiet');
  });

  it('has no accessibility problems', async () => {
    const { container } = render(
      <p>
        See <Link href="#">Important Dates</Link>, <Link level="quiet" href="https://x.org" external>source</Link>,{' '}
        <LinkButton>Show full year</LinkButton>
      </p>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('Tag', () => {
  it('selects with a click and shows a check mark, not only a color', async () => {
    render(
      <TagGroup label="Show" selectionMode="multiple">
        <Tag id="due">Due this week</Tag>
        <Tag id="done">Done</Tag>
      </TagGroup>,
    );
    const due = screen.getByRole('row', { name: 'Due this week' });
    await userEvent.click(due);
    expect(due.getAttribute('aria-selected')).toBe('true');
    expect(due.querySelector('.ds-tag__check')).toBeTruthy();
  });

  it('removes with the remove button and with Delete', async () => {
    const removed: string[] = [];
    render(
      <TagGroup label="Topics" onRemove={(keys) => removed.push(...([...keys] as string[]))}>
        <Tag id="fafsa">FAFSA</Tag>
        <Tag id="housing">Housing</Tag>
      </TagGroup>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove FAFSA' }));
    screen.getByRole('row', { name: 'Housing' }).focus();
    await userEvent.keyboard('{Delete}');
    expect(removed).toEqual(['fafsa', 'housing']);
  });

  it('has no accessibility problems', async () => {
    const { container } = render(
      <TagGroup label="Show" selectionMode="multiple" defaultSelectedKeys={['due']}>
        <Tag id="due">Due this week</Tag>
        <Tag id="done">Done</Tag>
      </TagGroup>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('Tabs', () => {
  const bills = () => (
    <Tabs defaultSelectedKey="upcoming">
      <TabList aria-label="Bills">
        <Tab id="upcoming">Upcoming</Tab>
        <Tab id="paid">Paid</Tab>
      </TabList>
      <TabPanel id="upcoming">Three due</TabPanel>
      <TabPanel id="paid">Nine paid</TabPanel>
    </Tabs>
  );

  it('moves with arrow keys and shows the matching panel', async () => {
    render(bills());
    screen.getByRole('tab', { name: 'Upcoming' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    const paid = screen.getByRole('tab', { name: 'Paid' });
    expect(paid.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toBe('Nine paid');
    expect(paid.querySelector('.ds-tabs__indicator')).toBeTruthy();
  });

  it('has no accessibility problems', async () => {
    const { container } = render(bills());
    await expectNoAxeViolations(container);
  });
});

describe('ToggleButtonGroup', () => {
  const showBy = (onChange?: (keys: Set<unknown>) => void) => (
    <ToggleButtonGroup aria-label="Show by" defaultSelectedKeys={['week']} onSelectionChange={(k) => onChange?.(k as Set<unknown>)}>
      <ToggleButton id="week">Week</ToggleButton>
      <ToggleButton id="month">Month</ToggleButton>
    </ToggleButtonGroup>
  );

  it('picks one option, shows the lens on it, and never clears', async () => {
    const changes: unknown[][] = [];
    render(showBy((k) => changes.push([...k])));
    const week = screen.getByRole('radio', { name: 'Week' });
    const month = screen.getByRole('radio', { name: 'Month' });
    await userEvent.click(month);
    expect(month.getAttribute('aria-checked')).toBe('true');
    expect(month.querySelector('.ds-toggle-group__indicator')).toBeTruthy();
    expect(week.querySelector('.ds-toggle-group__indicator')).toBeNull();
    await userEvent.click(month);
    expect(month.getAttribute('aria-checked')).toBe('true');
    expect(changes.every((c) => c.length === 1 && c[0] === 'month')).toBe(true);
  });

  it('has no accessibility problems', async () => {
    const { container } = render(showBy());
    await expectNoAxeViolations(container);
  });
});

// The old names keep working, so apps that use them don't break before they update.
describe('old names still work', () => {
  it('are the same components under their React Aria names', () => {
    expect(ProgressMeter).toBe(ProgressBar);
    expect(Divider).toBe(Separator);
    expect(Chip).toBe(Tag);
    expect(ChipGroup).toBe(TagGroup);
    expect(SegmentedControl).toBe(ToggleButtonGroup);
    expect(Segment).toBe(ToggleButton);
  });

  it('old prop names still work', () => {
    render(<Button disabled>Off</Button>);
    expect(screen.getByRole('button', { name: 'Off' }).hasAttribute('disabled')).toBe(true);
    render(<Checkbox label="Old" defaultChecked />);
    expect((screen.getByRole('checkbox', { name: 'Old' }) as HTMLInputElement).checked).toBe(true);
  });

  it('old callout tones map to the new ones', () => {
    const { container } = render(<Callout tone="overdue">Late</Callout>);
    expect(container.querySelector('.ds-callout--error')).toBeTruthy();
  });
});

describe('Select', () => {
  it('a visible label names it for screen readers', () => {
    render(<Select label="Year" options={[{ id: '1', label: 'Option 1' }]} defaultSelectedKey="1" />);
    expect(screen.getByRole('button', { name: /Year/ })).toBeTruthy();
  });
});

// Default is the subtle frosted look; Glass opts an element into the glass canvas (the ds-lens class).
describe('material', () => {
  it('cards start as Default and can switch to Glass', () => {
    const { container } = render(
      <>
        <Card>A</Card>
        <Card material="glass">B</Card>
      </>,
    );
    const [a, b] = Array.from(container.querySelectorAll('.ds-card'));
    expect(a.classList.contains('ds-lens')).toBe(false);
    expect(b.classList.contains('ds-lens')).toBe(true);
  });

  it('glass buttons start as Glass and can switch to Default', () => {
    render(
      <>
        <Button variant="glass">One</Button>
        <Button variant="glass" material="default">Two</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'One' }).classList.contains('ds-lens')).toBe(true);
    expect(screen.getByRole('button', { name: 'Two' }).classList.contains('ds-lens')).toBe(false);
  });
});

describe('Action tile', () => {
  // jsdom has no ResizeObserver; the page shell watches its size with one.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;

  it('is Solid by default, and ignores the old fill', async () => {
    const { container } = render(
      <ActionTileGroup aria-label="Tiles">
        <ActionTile onPress={() => {}} title="Title" />
        <ActionTile onPress={() => {}} fill="accent" title="Old fill" />
      </ActionTileGroup>,
    );
    expect(screen.getByRole('button', { name: /^Title/ }).className).not.toContain('ds-tile--glass');
    expect(screen.getByRole('button', { name: /Old fill/ }).className).not.toContain('fill');
    await expectNoAxeViolations(container);
  });

  it('is Glass on the page shell header, unless it asks for Solid', () => {
    render(
      <PageShell
        title="Page title"
        navigation={
          <ActionTileGroup aria-label="Tiles">
            <ActionTile onPress={() => {}} title="On the header" />
            <ActionTile onPress={() => {}} appearance="solid" title="Asked for solid" />
            <ActionTile onPress={() => {}} material="default" title="Old name" />
          </ActionTileGroup>
        }
      >
        <p>Content</p>
      </PageShell>,
    );
    expect(screen.getByRole('button', { name: /On the header/ }).className).toContain('ds-tile--glass');
    expect(screen.getByRole('button', { name: /Asked for solid/ }).className).not.toContain('ds-tile--glass');
    expect(screen.getByRole('button', { name: /Old name/ }).className).not.toContain('ds-tile--glass');
  });
});
