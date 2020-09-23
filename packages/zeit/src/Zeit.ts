import { ValueObject } from '@jamashita/publikum-object';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import utc from 'dayjs/plugin/utc';
import { ZeitError } from './Error/ZeitError';

dayjs.extend(utc);
dayjs.extend(minMax);

export type ZeitUnitType = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export class Zeit extends ValueObject<'Zeit'> {
  public readonly noun: 'Zeit' = 'Zeit';
  private readonly zeit: dayjs.Dayjs;
  private readonly format: string;

  public static of(zeit: dayjs.Dayjs, format: string): Zeit {
    return new Zeit(zeit, format);
  }

  public static ofString(str: string, format: string): Zeit {
    const zeit: dayjs.Dayjs = dayjs.utc(str, format);

    if (zeit.format(format) === str) {
      return Zeit.of(zeit, format);
    }

    throw new ZeitError(`ILLEGAL ZEIT SPECIFIED: ${str}`);
  }

  public static now(format: string): Zeit {
    return Zeit.of(dayjs.utc(), format);
  }

  public static max(zeiten: Iterable<Zeit>, format: string): Zeit {
    const z: Array<Zeit> = [...zeiten];

    if (z.length === 0) {
      throw new ZeitError('ZEITEN IS EMPTY');
    }
    if (z.length === 1) {
      return z[0];
    }

    const dates: Array<dayjs.Dayjs> = z.map<dayjs.Dayjs>((zeit: Zeit) => {
      return zeit.get();
    });

    const max: dayjs.Dayjs = dayjs.max(dates);

    return Zeit.of(max, format);
  }

  public static min(zeiten: Iterable<Zeit>, format: string): Zeit {
    const z: Array<Zeit> = [...zeiten];

    if (z.length === 0) {
      throw new ZeitError('ZEITEN IS EMPTY');
    }
    if (z.length === 1) {
      return z[0];
    }

    const dates: Array<dayjs.Dayjs> = z.map<dayjs.Dayjs>((zeit: Zeit) => {
      return zeit.get();
    });

    const min: dayjs.Dayjs = dayjs.min(dates);

    return Zeit.of(min, format);
  }

  private constructor(zeit: dayjs.Dayjs, format: string) {
    super();
    this.zeit = zeit;
    this.format = format;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Zeit)) {
      return false;
    }
    if (this.format !== other.format) {
      return false;
    }

    return this.zeit.isSame(other.zeit);
  }

  public serialize(): string {
    return this.zeit.format(this.format);
  }

  public get(): dayjs.Dayjs {
    return this.zeit;
  }

  public isValid(): boolean {
    return this.zeit.isValid();
  }

  public isBefore(other: Zeit): boolean {
    return this.zeit.isBefore(other.zeit);
  }

  public isAfter(other: Zeit): boolean {
    return this.zeit.isAfter(other.zeit);
  }

  public past(value: number, unit: ZeitUnitType): Zeit {
    return Zeit.of(this.zeit.subtract(value, unit), this.format);
  }

  public future(value: number, unit: ZeitUnitType): Zeit {
    return Zeit.of(this.zeit.add(value, unit), this.format);
  }
}
