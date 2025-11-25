import { _adapters } from 'chart.js';

type Unit =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

type FormatKey =
  | 'datetime'
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

type TimeInput = string | number | Date | null | undefined;

type IntlOptions = Intl.DateTimeFormatOptions & { weekday?: 'long' | 'short' | 'narrow' };

const UNIT_SIZE: Record<Unit, number> = {
  millisecond: 1,
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
  quarter: 1000 * 60 * 60 * 24 * 91,
  year: 1000 * 60 * 60 * 24 * 365,
};

const FORMATS: Record<FormatKey, string> = {
  datetime: 'MMM d, yyyy, h:mm:ss a',
  millisecond: 'h:mm:ss.SSS a',
  second: 'h:mm:ss a',
  minute: 'h:mm a',
  hour: 'h a',
  day: 'MMM d',
  week: 'MMM d',
  month: 'MMM yyyy',
  quarter: "'Q'Q yyyy",
  year: 'yyyy',
};

const INTL_OPTIONS: Record<FormatKey, IntlOptions> = {
  datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' },
  millisecond: { hour: 'numeric', minute: '2-digit', second: '2-digit' },
  second: { hour: 'numeric', minute: '2-digit', second: '2-digit' },
  minute: { hour: 'numeric', minute: '2-digit' },
  hour: { hour: 'numeric' },
  day: { month: 'short', day: 'numeric' },
  week: { month: 'short', day: 'numeric' },
  month: { year: 'numeric', month: 'short' },
  quarter: { year: 'numeric', month: 'short' },
  year: { year: 'numeric' },
};

function toDate(input: TimeInput): Date | null {
  if (input === null || typeof input === 'undefined') return null;
  if (input instanceof Date) return new Date(input.getTime());
  if (typeof input === 'number') return new Date(input);
  const parsed = Date.parse(input);
  return Number.isNaN(parsed) ? null : new Date(parsed);
}

function startOf(date: Date, unit: Unit): Date {
  const d = new Date(date.getTime());

  switch (unit) {
    case 'year':
      d.setMonth(0);
    // falls through
    case 'quarter':
      if (unit === 'quarter') {
        const currentQuarter = Math.floor(d.getMonth() / 3) * 3;
        d.setMonth(currentQuarter);
      }
    // falls through
    case 'month':
      d.setDate(1);
    // falls through
    case 'week': {
      const day = d.getDay();
      const diff = (day + 6) % 7; // start week on Monday
      d.setDate(d.getDate() - diff);
    }
    // falls through
    case 'day':
      d.setHours(0);
    // falls through
    case 'hour':
      d.setMinutes(0);
    // falls through
    case 'minute':
      d.setSeconds(0);
    // falls through
    case 'second':
      d.setMilliseconds(0);
      break;
    case 'millisecond':
    default:
      break;
  }

  return d;
}

function endOf(date: Date, unit: Unit): Date {
  const d = startOf(date, unit);
  if (unit === 'millisecond') {
    return d;
  }
  return new Date(d.getTime() + UNIT_SIZE[unit]);
}

function formatDate(value: number, format: FormatKey): string {
  const formatter = new Intl.DateTimeFormat(undefined, INTL_OPTIONS[format]);
  return formatter.format(new Date(value));
}

_adapters._date.override({
  // @ts-expect-error Chart.js allows an _id on adapters even if the typings omit it
  _id: 'native-date-adapter',
  formats: () => ({ ...FORMATS }),
  parse(value: TimeInput, format?: FormatKey) {
    if (typeof value === 'number') {
      return value;
    }
    const date = toDate(value);
    return date ? date.getTime() : null;
  },
  format(time: number, format: string) {
    const safeFormat: FormatKey = (format as FormatKey) in FORMATS ? (format as FormatKey) : 'datetime';
    return formatDate(time, safeFormat);
  },
  add(time: number, amount: number, unit: Unit) {
    return time + amount * UNIT_SIZE[unit];
  },
  diff(max: number, min: number, unit: Unit) {
    return (max - min) / UNIT_SIZE[unit];
  },
  startOf(time: number, unit: Unit) {
    const date = toDate(time);
    return date ? startOf(date, unit).getTime() : NaN;
  },
  endOf(time: number, unit: Unit) {
    const date = toDate(time);
    return date ? endOf(date, unit).getTime() : NaN;
  },
});
