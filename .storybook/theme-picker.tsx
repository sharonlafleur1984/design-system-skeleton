import { useEffect, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-aria-components';
import { addons } from 'storybook/preview-api';
import { UPDATE_GLOBALS } from 'storybook/internal/core-events';
import themes from '../build/themes.json';
import './theme-picker.css';

// Storybook only: the theme picker shown on the page, above the stories. It changes the same setting
// as the toolbar's Theme menu, so the two always agree. It's styled as Storybook's own chrome, not in
// any theme, so it never reads as part of the component being shown.

const choices = [...themes.map((t) => ({ id: t.id, name: t.name })), { id: 'both', name: 'Compare all' }];

/** Sent by the preview's decorator whenever a story renders, so the Docs page picker can show the current choice. */
export const THEME_CHOICE_EVENT = 'sb-theme-choice';

/** The picker for a Docs page, shown once at the top. A Docs page isn't a story, so it follows what the stories on it render with. */
export function DocsThemePicker() {
  const [value, setValue] = useState(() => document.documentElement.dataset.themeChoice ?? themes[0].id);
  useEffect(() => {
    const update = () => setValue(document.documentElement.dataset.themeChoice ?? themes[0].id);
    update();
    window.addEventListener(THEME_CHOICE_EVENT, update);
    return () => window.removeEventListener(THEME_CHOICE_EVENT, update);
  }, []);
  return <ThemePicker value={value} />;
}

export function ThemePicker({ value }: { value: string }) {
  return (
    <div className="sb-theme-picker">
      <span className="sb-theme-picker__label" id="sb-theme-picker-label">
        Theme
      </span>
      <ToggleButtonGroup
        aria-labelledby="sb-theme-picker-label"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          const [theme] = [...keys];
          if (theme) addons.getChannel().emit(UPDATE_GLOBALS, { globals: { theme } });
        }}
        className="sb-theme-picker__group"
      >
        {choices.map((c) => (
          <ToggleButton key={c.id} id={c.id} className="sb-theme-picker__choice">
            {c.name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
