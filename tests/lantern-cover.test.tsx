// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { lightCover } from '../src/lantern/cover-light';
import { LanternCover } from '../src/lantern/lantern-cover';
import coverHtml from '../scripts/lantern/cover.html?raw';
import mark from '../scripts/lantern/lantern-mark.svg?raw';

afterEach(cleanup);

describe("Lantern's cover (D60)", () => {
  it('keeps the drawing as it is where there is no 3D', async () => {
    document.body.innerHTML = coverHtml;
    const cover = document.querySelector<HTMLElement>('.cover');
    await lightCover(cover);
    expect(cover?.dataset.lit).toBeUndefined();
    expect(cover?.querySelectorAll('canvas')).toHaveLength(0);
    for (const el of Array.from(document.querySelectorAll<SVGElement>('[data-lm]'))) expect(el.style.visibility).toBe('');
  });

  it('labels every part the renderer redraws, the same in the cover and the mark', () => {
    const parts = (text: string) => [...text.matchAll(/data-lm="([a-z]+)"/g)].map((m) => m[1]);
    expect(parts(coverHtml)).toEqual(parts(mark));
    for (const part of ['glow', 'floor', 'copper', 'lip', 'accent', 'inside', 'orb']) expect(parts(mark)).toContain(part);
  });

  it("names Lantern on Storybook's Welcome page, with the cover's words", () => {
    const { container } = render(<LanternCover />);
    expect(container.querySelector('h1')?.textContent).toBe('Lantern');
    expect(container.textContent).toContain('The light you leave behind can reach far.');
    expect(container.querySelector('script')).toBeNull();
  });
});
