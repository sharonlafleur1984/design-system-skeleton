// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { Button, Card, Callout, ProgressMeter, Checkbox, Switch, Divider, Link, LinkButton, Chip, ChipGroup, Tabs, TabList, Tab, TabPanel, SegmentedControl, Segment } from '../src/components';

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
        <Button disabled onClick={() => clicks++}>Off</Button>
        <Button loading onClick={() => clicks++}>Busy</Button>
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
  it('renders the element asked for', () => {
    render(<Card as="section" aria-label="This week">Hi</Card>);
    expect(screen.getByRole('region', { name: 'This week' }).className).toContain('ds-card--translucent');
  });
});

describe('Callout', () => {
  it('says what the tone means in words, not just color', () => {
    render(<Callout tone="overdue" title="2 days late">Recommendation letter.</Callout>);
    expect(screen.getByText(/Overdue:/)).toBeTruthy();
  });

  it('passes an accessibility scan', async () => {
    const { container } = render(<Callout tone="due">Fee due Friday.</Callout>);
    await expectNoAxeViolations(container);
  });
});

describe('ProgressMeter', () => {
  it('exposes its label and value to screen readers', () => {
    render(<ProgressMeter value={3} max={5} label="Checklist" />);
    const bar = screen.getByRole('progressbar', { name: 'Checklist' });
    expect(bar.getAttribute('aria-valuenow')).toBe('3');
    expect(bar.getAttribute('aria-valuetext')).toBe('3 of 5');
  });

  it('keeps the value between 0 and max', () => {
    render(<ProgressMeter value={9} max={5} label="Too much" />);
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
    const { container } = render(<Checkbox label="Done" defaultChecked />);
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
    const { container } = render(<Switch label="Email reminders" defaultChecked />);
    await expectNoAxeViolations(container);
  });
});

describe('Divider', () => {
  it('is announced as a separator', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toBeTruthy();
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

describe('Chip', () => {
  it('selects with a click and shows a check mark, not only a color', async () => {
    render(
      <ChipGroup label="Show" selectionMode="multiple">
        <Chip id="due">Due this week</Chip>
        <Chip id="done">Done</Chip>
      </ChipGroup>,
    );
    const due = screen.getByRole('row', { name: 'Due this week' });
    await userEvent.click(due);
    expect(due.getAttribute('aria-selected')).toBe('true');
    expect(due.querySelector('.ds-chip__check')).toBeTruthy();
  });

  it('removes with the remove button and with Delete', async () => {
    const removed: string[] = [];
    render(
      <ChipGroup label="Topics" onRemove={(keys) => removed.push(...([...keys] as string[]))}>
        <Chip id="fafsa">FAFSA</Chip>
        <Chip id="housing">Housing</Chip>
      </ChipGroup>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove FAFSA' }));
    screen.getByRole('row', { name: 'Housing' }).focus();
    await userEvent.keyboard('{Delete}');
    expect(removed).toEqual(['fafsa', 'housing']);
  });

  it('has no accessibility problems', async () => {
    const { container } = render(
      <ChipGroup label="Show" selectionMode="multiple" defaultSelectedKeys={['due']}>
        <Chip id="due">Due this week</Chip>
        <Chip id="done">Done</Chip>
      </ChipGroup>,
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

describe('SegmentedControl', () => {
  const showBy = (onChange?: (keys: Set<unknown>) => void) => (
    <SegmentedControl aria-label="Show by" defaultSelectedKeys={['week']} onSelectionChange={(k) => onChange?.(k as Set<unknown>)}>
      <Segment id="week">Week</Segment>
      <Segment id="month">Month</Segment>
    </SegmentedControl>
  );

  it('picks one option, shows the lens on it, and never clears', async () => {
    const changes: unknown[][] = [];
    render(showBy((k) => changes.push([...k])));
    const week = screen.getByRole('radio', { name: 'Week' });
    const month = screen.getByRole('radio', { name: 'Month' });
    await userEvent.click(month);
    expect(month.getAttribute('aria-checked')).toBe('true');
    expect(month.querySelector('.ds-segmented__lens')).toBeTruthy();
    expect(week.querySelector('.ds-segmented__lens')).toBeNull();
    await userEvent.click(month);
    expect(month.getAttribute('aria-checked')).toBe('true');
    expect(changes.every((c) => c.length === 1 && c[0] === 'month')).toBe(true);
  });

  it('has no accessibility problems', async () => {
    const { container } = render(showBy());
    await expectNoAxeViolations(container);
  });
});
