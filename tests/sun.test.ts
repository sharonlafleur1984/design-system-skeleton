import { describe, it, expect } from 'vitest';
import { sunTimes, skyHourFor, SKY_SUNRISE, SKY_SUNSET } from '../src/explorations/sky-header/sun';

// Published Denver times, https://www.timeanddate.com/sun/usa/denver
// June 21: sunrise 5:32 am, sunset 8:31 pm. December 21: sunrise 7:18 am, sunset 4:39 pm.
const hm = (h: number, m: number) => h + m / 60;
const within = (got: number, want: number, minutes: number) => expect(Math.abs(got - want) * 60).toBeLessThan(minutes);

describe('sunTimes', () => {
  it('matches Denver in June, daylight saving included', () => {
    const t = sunTimes(new Date('2026-06-21T18:00:00Z'), 'America/Denver');
    within(t.sunrise, hm(5, 32), 6);
    within(t.sunset, hm(20, 31), 6);
  });

  it('matches Denver in December', () => {
    const t = sunTimes(new Date('2026-12-21T19:00:00Z'), 'America/Denver');
    within(t.sunrise, hm(7, 18), 6);
    within(t.sunset, hm(16, 39), 6);
  });

  it('falls back to a sensible day for an unknown zone', () => {
    const t = sunTimes(new Date('2026-03-20T12:00:00Z'), 'Etc/GMT+7');
    expect(t.sunrise).toBeGreaterThan(5);
    expect(t.sunset).toBeLessThan(20);
  });
});

describe('skyHourFor', () => {
  it('puts the real sunrise and sunset on the sky\'s sunrise and sunset', () => {
    const sun = { sunrise: hm(7, 18), sunset: hm(16, 39) };
    expect(skyHourFor(sun.sunrise, sun)).toBeCloseTo(SKY_SUNRISE);
    expect(skyHourFor(sun.sunset, sun)).toBeCloseTo(SKY_SUNSET);
    expect(skyHourFor(0, sun)).toBe(0);
  });
});
