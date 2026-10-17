import type { ComponentPageInfo } from '../../.storybook/component-page';

// Storybook only: every part the design system plans to have but hasn't built yet (inventory approved
// by Sharon, Oct 15). Each gets its page now, so the sidebar shows the whole library and its status.
// When one is built, its folder moves to src/components with real stories, and its entry here goes.

type Planned = Pick<ComponentPageInfo, 'summary' | 'status' | 'builtWith' | 'useFor' | 'useForNotes' | 'useElse' | 'related'>;

const updated = '2026-10-15';
const ra = (reactAria: string) => ({ reactAria });
const ours = {};
const issue = (n: number) => (
  <a href={`https://github.com/sharonlafleur1984/lantern-design-system/issues/${n}`} target="_blank" rel="noreferrer">
    The plan, in issue {n}
  </a>
);

export const planned: Record<string, Planned> = {
  'Components/Toggle button': {
    summary: 'Turns one thing on or off and stays that way, like Favorite.',
    status: 'not-started',
    builtWith: ra('ToggleButton'),
    useFor: ['Marking one thing, like a favorite or a pin.'],
    useElse: [
      { job: 'Picking one of a few choices', instead: { name: 'Toggle button group', title: 'Components/Toggle button group' } },
      { job: 'A setting that changes how the app works', instead: { name: 'Switch', title: 'Components/Switch' } },
    ],
  },
  'Components/Menu': {
    summary: 'Opens a list of actions from a button.',
    status: 'not-started',
    builtWith: ra('Menu'),
    useForNotes: [issue(42)],
    useFor: ['Several actions that would crowd the screen as buttons.', 'The settings menu at the top right.'],
    useElse: [{ job: 'Picking a value for a form', instead: { name: 'Select', title: 'Components/Select' } }],
    related: [{ name: 'Settings menu', title: 'Patterns/Settings menu' }],
  },
  'Components/Toolbar': {
    summary: 'Groups related buttons in a row that the arrow keys move between.',
    status: 'on-hold',
    builtWith: ra('Toolbar'),
    useFor: ['A set of tools for one thing, like text formatting.'],
  },
  'Components/Text field': {
    summary: 'Lets people type a word or a sentence.',
    status: 'not-started',
    builtWith: ra('TextField'),
    useFor: ['Names, emails, short answers and notes.'],
    useElse: [
      { job: 'Looking something up', instead: { name: 'Search field', title: 'Components/Search field' } },
      { job: 'Typing a number', instead: { name: 'Number field', title: 'Components/Number field' } },
    ],
    related: [{ name: 'Form', title: 'Patterns/Form' }],
  },
  'Components/Search field': {
    summary: 'Lets people type what they’re looking for, with a button to clear it.',
    status: 'not-started',
    builtWith: ra('SearchField'),
    useFor: ['Searching a page, a list or the whole app.'],
    related: [{ name: 'Autocomplete', title: 'Components/Autocomplete' }],
  },
  'Components/Autocomplete': {
    summary: 'Filters a list or a menu as people type.',
    status: 'not-started',
    builtWith: ra('Autocomplete'),
    useFor: ['Finding one item in a long list by typing part of it.'],
    useElse: [{ job: 'Picking a value for a form from a long list', instead: { name: 'Combo box', title: 'Components/Combo box' } }],
  },
  'Components/Number field': {
    summary: 'Lets people type a number or step it up and down.',
    status: 'not-started',
    builtWith: ra('NumberField'),
    useFor: ['Amounts, counts and quantities.'],
    useElse: [{ job: 'A rough value along a range', instead: { name: 'Slider', title: 'Components/Slider' } }],
  },
  'Components/Checkbox group': {
    summary: 'Lets people pick any number of choices from a short list.',
    status: 'not-started',
    builtWith: ra('CheckboxGroup'),
    useFor: ['Picking several things from a list of up to about seven.'],
    useElse: [{ job: 'Picking exactly one', instead: { name: 'Radio group', title: 'Components/Radio group' } }],
    related: [{ name: 'Checkbox', title: 'Components/Checkbox' }],
  },
  'Components/Radio group': {
    summary: 'Lets people pick exactly one choice from a short list.',
    status: 'not-started',
    builtWith: ra('RadioGroup'),
    useFor: ['One answer from two to seven, all shown at once.'],
    useElse: [
      { job: 'Six or more choices', instead: { name: 'Select', title: 'Components/Select' } },
      { job: 'Switching a view right away', instead: { name: 'Toggle button group', title: 'Components/Toggle button group' } },
    ],
  },
  'Components/Combo box': {
    summary: 'Lets people pick one choice from a long list by typing.',
    status: 'not-started',
    builtWith: ra('ComboBox'),
    useFor: ['Long lists people know the answer to, like a school or a state.'],
    useElse: [{ job: 'Fewer than about fifteen choices', instead: { name: 'Select', title: 'Components/Select' } }],
  },
  'Components/Slider': {
    summary: 'Lets people pick a value along a range.',
    status: 'on-hold',
    builtWith: ra('Slider'),
    useFor: ['A value where close enough is fine, like volume.'],
    useElse: [{ job: 'An exact number', instead: { name: 'Number field', title: 'Components/Number field' } }],
  },
  'Components/Date picker': {
    summary: 'Lets people type a date or pick it from a calendar.',
    status: 'not-started',
    builtWith: ra('DatePicker'),
    useFor: ['Due dates, appointments and birthdays.'],
    related: [{ name: 'Calendar', title: 'Components/Calendar' }],
  },
  'Components/Date range picker': {
    summary: 'Lets people pick a start date and an end date.',
    status: 'on-hold',
    builtWith: ra('DateRangePicker'),
    useFor: ['Trips, terms and other spans of days.'],
  },
  'Components/Time field': {
    summary: 'Lets people type a time.',
    status: 'on-hold',
    builtWith: ra('TimeField'),
    useFor: ['A time of day, like a reminder.'],
  },
  'Components/Calendar': {
    summary: 'Shows a month to pick a date or a range from.',
    status: 'not-started',
    builtWith: ra('Calendar'),
    useFor: ['Picking a date where seeing the week around it helps.'],
    related: [{ name: 'Date picker', title: 'Components/Date picker' }],
  },
  'Components/File trigger': {
    summary: 'Opens the file picker so people can upload a file.',
    status: 'on-hold',
    builtWith: ra('FileTrigger'),
    useFor: ['Adding a photo or a document.'],
    related: [{ name: 'Drop zone', title: 'Components/Drop zone' }],
  },
  'Components/Drop zone': {
    summary: 'Gives people a place to drag a file into.',
    status: 'on-hold',
    builtWith: ra('DropZone'),
    useFor: ['Uploading files on a computer, next to a File trigger.'],
  },
  'Components/Color picker': {
    summary: 'Lets people pick a color.',
    status: 'on-hold',
    builtWith: ra('ColorPicker'),
    useFor: ['Choosing a color for something people make or own.'],
  },
  'Components/List box': {
    summary: 'Shows a list people pick one or more items from.',
    status: 'not-started',
    builtWith: ra('ListBox'),
    useFor: ['A list of options that stays open on the page.'],
    useElse: [{ job: 'Items with their own actions', instead: { name: 'Grid list', title: 'Components/Grid list' } }],
  },
  'Components/Grid list': {
    summary: 'Shows a list of rich items, like cards, that people can pick and act on.',
    status: 'not-started',
    builtWith: ra('GridList'),
    useFor: ['A list where each item has its own buttons or links.'],
    useElse: [{ job: 'Rows that compare the same details', instead: { name: 'Table', title: 'Components/Table' } }],
  },
  'Components/Table': {
    summary: 'Shows rows and columns that people can sort and pick from.',
    status: 'not-started',
    builtWith: ra('Table'),
    useFor: ['Comparing the same details across many items.'],
  },
  'Components/Tree': {
    summary: 'Shows a list with nested levels that open and close.',
    status: 'on-hold',
    builtWith: ra('Tree'),
    useFor: ['Folders and other things inside things.'],
  },
  'Components/Breadcrumbs': {
    summary: 'Shows where a page sits and links back up.',
    status: 'not-started',
    builtWith: ra('Breadcrumbs'),
    useFor: ['Pages three or more levels deep.'],
    useElse: [{ job: 'Switching between views on one page', instead: { name: 'Tabs', title: 'Components/Tabs' } }],
  },
  'Components/Disclosure': {
    summary: 'Shows or hides one section, like the answer to a question.',
    status: 'not-started',
    builtWith: ra('Disclosure'),
    useFor: ['Details most people don’t need to see.'],
    related: [{ name: 'Disclosure group', title: 'Components/Disclosure group' }],
  },
  'Components/Disclosure group': {
    summary: 'Groups disclosures, often with only one open at a time.',
    status: 'not-started',
    builtWith: ra('DisclosureGroup'),
    useFor: ['A list of questions and answers.'],
  },
  'Components/Dialog': {
    summary: 'Asks for a decision or a few details on top of the page.',
    status: 'not-started',
    builtWith: ra('Modal'),
    useFor: ['Confirming something that can’t be undone.', 'A short task that shouldn’t leave the page.'],
    useElse: [{ job: 'A message that needs no answer', instead: { name: 'Toast', title: 'Components/Toast' } }],
    related: [{ name: 'Modal', title: 'Components/Modal' }],
  },
  'Components/Modal': {
    summary: 'Holds a dialog and dims the page behind it.',
    status: 'not-started',
    builtWith: ra('Modal'),
    useFor: ['Every dialog. People use Dialog; Modal is the layer under it.'],
    related: [{ name: 'Dialog', title: 'Components/Dialog' }],
  },
  'Components/Popover': {
    summary: 'Opens a small panel next to what opened it.',
    status: 'not-started',
    builtWith: ra('Popover'),
    useFor: ['A few extra details or settings that belong to one thing.'],
    useElse: [{ job: 'A hint of a few words', instead: { name: 'Tooltip', title: 'Components/Tooltip' } }],
  },
  'Components/Tooltip': {
    summary: 'Shows a short hint on hover or focus.',
    status: 'not-started',
    builtWith: ra('Tooltip'),
    useFor: ['Naming a button that only has an icon.'],
    useElse: [{ job: 'Anything people must read', instead: { name: 'Callout', title: 'Components/Callout' } }],
  },
  'Components/Toast': {
    summary: 'Says what just happened, then goes away.',
    status: 'not-started',
    builtWith: ra('Toast'),
    useForNotes: [issue(72)],
    useFor: ['Confirming an action, like Saved.', 'An error with a way to try again.'],
    useElse: [{ job: 'A message that should stay on the page', instead: { name: 'Callout', title: 'Components/Callout' } }],
  },
  'Components/Icon': {
    summary: 'Draws one shared set of icons, sized and colored by tokens.',
    status: 'not-started',
    builtWith: ours,
    useForNotes: [issue(40)],
    useFor: ['Icons in buttons, tiles and the bottom bar.'],
  },
  'Components/Avatar': {
    summary: 'Shows a person’s picture or initials.',
    status: 'not-started',
    builtWith: ours,
    useFor: ['Showing who something belongs to.'],
  },
  'Patterns/Settings menu': {
    summary: 'Puts a settings button at the top right that opens a menu.',
    status: 'not-started',
    builtWith: ours,
    useForNotes: [issue(42)],
    useFor: ['App-wide settings, like Motion, on every screen.'],
    related: [
      { name: 'Menu', title: 'Components/Menu' },
      { name: 'Settings', title: 'Patterns/Settings' },
    ],
  },
  'Patterns/Bottom bar': {
    summary: 'Moves the main sections to a bar at the bottom of a phone screen.',
    status: 'not-started',
    builtWith: ours,
    useForNotes: [issue(41)],
    useFor: ['Two to five main sections on phones.'],
    related: [{ name: 'Icon', title: 'Components/Icon' }],
  },
  'Patterns/Form': {
    summary: 'Puts fields, labels, errors and the submit button together.',
    status: 'not-started',
    builtWith: ra('Form'),
    useFor: ['Any time people fill in details and send them.'],
    related: [{ name: 'Text field', title: 'Components/Text field' }],
  },
  'Patterns/Empty state': {
    summary: 'Shows what a page or list looks like before there’s anything in it.',
    status: 'not-started',
    builtWith: ours,
    useFor: ['A first visit, or a search with no results.'],
  },
};

/** A planned part's page words, filled in from its entry above. */
export const plannedPage = (title: string): ComponentPageInfo => ({ updated, ...planned[title] });
