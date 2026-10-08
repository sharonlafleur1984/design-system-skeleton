// Sunrise and sunset for a day, from the time zone alone (no location permission needed).
// Method: NOAA's general solar position equations, https://gml.noaa.gov/grad/solcalc/solareqns.PDF
// The zone's main city stands in for where the person is, so times can be off by a few minutes to
// about half an hour at the edges of a zone (estimate).

// IANA zone names are cities, so each maps to that city's latitude and longitude.
const ZONES: Record<string, [number, number]> = {
  'America/Denver': [39.74, -104.99],
  'America/Boise': [43.62, -116.2],
  'America/Phoenix': [33.45, -112.07],
  'America/Los_Angeles': [34.05, -118.24],
  'America/Chicago': [41.88, -87.63],
  'America/New_York': [40.71, -74.01],
  'America/Detroit': [42.33, -83.05],
  'America/Indiana/Indianapolis': [39.77, -86.16],
  'America/Anchorage': [61.22, -149.9],
  'Pacific/Honolulu': [21.31, -157.86],
  'America/Toronto': [43.65, -79.38],
  'America/Vancouver': [49.28, -123.12],
  'America/Edmonton': [53.55, -113.49],
  'America/Winnipeg': [49.9, -97.14],
  'America/Halifax': [44.65, -63.58],
  'America/Mexico_City': [19.43, -99.13],
  'America/Sao_Paulo': [-23.55, -46.63],
  'America/Argentina/Buenos_Aires': [-34.6, -58.38],
  'Europe/London': [51.51, -0.13],
  'Europe/Dublin': [53.35, -6.26],
  'Europe/Paris': [48.86, 2.35],
  'Europe/Berlin': [52.52, 13.4],
  'Europe/Madrid': [40.42, -3.7],
  'Europe/Rome': [41.9, 12.5],
  'Europe/Amsterdam': [52.37, 4.9],
  'Europe/Stockholm': [59.33, 18.07],
  'Europe/Athens': [37.98, 23.73],
  'Europe/Moscow': [55.76, 37.62],
  'Africa/Cairo': [30.04, 31.24],
  'Africa/Johannesburg': [-26.2, 28.05],
  'Africa/Lagos': [6.52, 3.38],
  'Asia/Dubai': [25.2, 55.27],
  'Asia/Kolkata': [22.57, 88.36],
  'Asia/Singapore': [1.35, 103.82],
  'Asia/Shanghai': [31.23, 121.47],
  'Asia/Tokyo': [35.68, 139.69],
  'Asia/Seoul': [37.57, 126.98],
  'Australia/Sydney': [-33.87, 151.21],
  'Australia/Perth': [-31.95, 115.86],
  'Pacific/Auckland': [-36.85, 174.76],
};

/** Minutes the zone is ahead of UTC on that date (daylight saving included). */
function zoneOffsetMinutes(date: Date, timeZone: string) {
  const name = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const m = name.match(/GMT([+-])(\d+)(?::(\d+))?/);
  if (!m) return 0;
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

/** The calendar day in that zone, as day of the year (1 to 366). */
function dayOfYear(date: Date, timeZone: string) {
  const [y, mo, d] = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(date)
    .split('-')
    .map(Number);
  return Math.round((Date.UTC(y, mo - 1, d) - Date.UTC(y, 0, 0)) / 86_400_000);
}

export interface SunTimes {
  /** Local clock hours, for example 7.3 is 7:18 am. */
  sunrise: number;
  sunset: number;
}

/** Sunrise and sunset on a date, in local clock hours for the time zone. */
export function sunTimes(date: Date, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone): SunTimes {
  const offset = zoneOffsetMinutes(date, timeZone);
  // Unknown zone: guess the longitude from the clock and use a middle latitude.
  const [lat, lon] = ZONES[timeZone] ?? [40, (offset / 60) * 15];
  const rad = Math.PI / 180;
  const g = ((2 * Math.PI) / 365) * (dayOfYear(date, timeZone) - 1);
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const cosHa = Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(decl)) - Math.tan(lat * rad) * Math.tan(decl);
  // Polar day or night: fall back to an ordinary day.
  if (cosHa < -1 || cosHa > 1) return { sunrise: 6.5, sunset: 18.75 };
  const ha = Math.acos(cosHa) / rad;
  const toLocal = (utcMinutes: number) => (((utcMinutes + offset) / 60) % 24 + 24) % 24;
  return {
    sunrise: toLocal(720 - 4 * (lon + ha) - eqTime),
    sunset: toLocal(720 - 4 * (lon - ha) - eqTime),
  };
}

// The sky in sky.ts is drawn for a day with sunrise at 6:30 and sunset at 6:45. These are its anchors.
export const SKY_SUNRISE = 6.5;
export const SKY_SUNSET = 18.75;

/** Turns a real clock hour into the sky's hour, so dawn and dusk land on the real sunrise and sunset. */
export function skyHourFor(hour: number, { sunrise, sunset }: SunTimes) {
  const h = ((hour % 24) + 24) % 24;
  if (h < sunrise) return (h / sunrise) * SKY_SUNRISE;
  if (h < sunset) return SKY_SUNRISE + ((h - sunrise) / (sunset - sunrise)) * (SKY_SUNSET - SKY_SUNRISE);
  return SKY_SUNSET + ((h - sunset) / (24 - sunset)) * (24 - SKY_SUNSET);
}
