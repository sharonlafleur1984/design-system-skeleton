import { useEffect, useRef, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-aria-components';
import { addons } from 'storybook/preview-api';
import { UPDATE_GLOBALS } from 'storybook/internal/core-events';
import themes from '../build/themes.json';
import { defaultModeForTheme } from './theme-mode';
import './theme-picker.css';

// Storybook only: the bar shown on the page, above the stories. It changes the same settings as the
// toolbar (theme, light or dark mode, and the background), so the two always agree. It's styled as
// Storybook's own chrome, not in any theme, so it never reads as part of the component being shown.

type ThemeMeta = { id: string; name: string; alwaysDark?: boolean; defaultMode?: 'light' | 'dark'; backgrounds?: { name: string; file: string }[] };
const themeList = themes as ThemeMeta[];
const choices = [...themeList.map((t) => ({ id: t.id, name: t.name })), { id: 'both', name: 'Compare all' }];

/** What the bar shows: the theme picked, light or dark mode, and the background (empty for the plain page). */
export type PickerState = { theme: string; mode: string; background: string };

/** Sent by the preview's decorator whenever a story renders, so the Docs page bar can show the current settings. */
export const THEME_CHOICE_EVENT = 'sb-theme-choice';

const readState = (): PickerState => {
  const d = document.documentElement.dataset;
  return { theme: d.themeChoice ?? themeList[0].id, mode: d.sbMode ?? 'light', background: d.sbBackground ?? '' };
};

const update = (globals: Partial<Record<'theme' | 'mode' | 'background', string>>) => addons.getChannel().emit(UPDATE_GLOBALS, { globals });

/** The bar for a Docs page, shown once at the top. A Docs page isn't a story, so it follows what the stories on it render with. */
export function DocsThemePicker() {
  const [state, setState] = useState(readState);
  useEffect(() => {
    const sync = () => setState(readState());
    sync();
    window.addEventListener(THEME_CHOICE_EVENT, sync);
    return () => window.removeEventListener(THEME_CHOICE_EVENT, sync);
  }, []);
  return <ThemePicker {...state} />;
}

export function ThemePicker({ theme, mode, background }: PickerState) {
  const previousTheme = useRef(theme);
  useEffect(() => {
    if (previousTheme.current === theme) return;
    previousTheme.current = theme;
    update({ mode: defaultModeForTheme(theme, themeList) });
  }, [theme]);

  const selectTheme = (next: string) => {
    previousTheme.current = next;
    update({ theme: next, mode: defaultModeForTheme(next, themeList) });
  };
  const shown = theme === 'both' ? themeList : themeList.filter((t) => t.id === theme);
  // Only what applies: no Mode for a theme that's always dark, no Background for a theme without any.
  const hasMode = shown.some((t) => !t.alwaysDark);
  const backgrounds = shown.flatMap((t) => t.backgrounds ?? []);
  return (
    <div className="sb-theme-picker">
      <div className="sb-theme-picker__field">
        <span className="sb-theme-picker__label" id="sb-theme-picker-theme">
          Theme
        </span>
        <ToggleButtonGroup
          aria-labelledby="sb-theme-picker-theme"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[theme]}
          onSelectionChange={(keys) => {
            const [next] = [...keys];
            if (next) selectTheme(String(next));
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
      {hasMode && (
        <div className="sb-theme-picker__field">
          <span className="sb-theme-picker__label" id="sb-theme-picker-mode">
            Mode
          </span>
          <ToggleButtonGroup
            aria-labelledby="sb-theme-picker-mode"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[mode]}
            onSelectionChange={(keys) => {
              const [next] = [...keys];
              if (next) update({ mode: String(next) });
            }}
            className="sb-theme-picker__group"
          >
            <ToggleButton id="light" className="sb-theme-picker__choice">
              Light
            </ToggleButton>
            <ToggleButton id="dark" className="sb-theme-picker__choice">
              Dark
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      )}
      {backgrounds.length > 0 && (
        <label className="sb-theme-picker__field">
          <span className="sb-theme-picker__label">Background</span>
          <select className="sb-theme-picker__select" value={background} onChange={(e) => update({ background: e.target.value })}>
            <option value="">Plain page</option>
            {backgrounds.map((b) => (
              <option key={b.file} value={b.file}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
