import { MockValueObject } from '@jamashita/publikum-object';
import dayjs from 'dayjs';
import sinon, { SinonFakeTimers } from 'sinon';
import { ZeitError } from '../Error/ZeitError';
import { Zeit } from '../Zeit';

describe('Zeit', () => {
  describe('ofString', () => {
    it('returns instance', () => {
      expect.assertions(2);

      const zeit1: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-01 01:02:03', 'YYYY-MM-DD HH:mm:ss');

      expect(zeit1.isValid()).toBe(true);
      expect(zeit2.isValid()).toBe(true);
    });

    it('throws ZeitError when the format is incorrect', () => {
      expect.assertions(2);

      expect(() => {
        Zeit.ofString('2000-01-01', 'YYYY-MM-DD HH:mm:ss');
      }).toThrow(ZeitError);

      expect(() => {
        Zeit.ofString('2000-01-01 01:02:03', 'YYYY-MM-DD');
      }).toThrow(ZeitError);
    });
  });

  describe('now', () => {
    it('returns current timestamp', () => {
      expect.assertions(1);

      const clock: SinonFakeTimers = sinon.useFakeTimers(946684800000);

      expect(Zeit.now('YYYY-MM-DD HH:mm:ss').toString()).toBe('2000-01-01 00:00:00');

      clock.restore();
    });
  });

  describe('max', () => {
    it('returns maximum Zeit', () => {
      expect.assertions(1);

      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [
        Zeit.ofString('2000-01-03', format),
        Zeit.ofString('2000-01-01', format),
        Zeit.ofString('2000-01-02', format),
        Zeit.ofString('2000-01-03', format)
      ];

      const max: Zeit = Zeit.max(zeiten, format);

      expect(max.toString()).toBe('2000-01-03');
    });

    it('returns itself when the only one Zeit given', () => {
      expect.assertions(1);

      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [Zeit.ofString('2000-01-01', format)];

      const max: Zeit = Zeit.max(zeiten, format);

      expect(max).toBe(zeiten[0]);
    });

    it('throws ZeitError when empty array given', () => {
      expect.assertions(1);

      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [];

      expect(() => {
        Zeit.max(zeiten, format);
      }).toThrow(ZeitError);
    });
  });

  describe('min', () => {
    it('returns minimum Zeit', () => {
      expect.assertions(1);

      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [
        Zeit.ofString('2000-01-03', format),
        Zeit.ofString('2000-01-02', format),
        Zeit.ofString('2000-01-01', format),
        Zeit.ofString('2000-01-02', format)
      ];

      const min: Zeit = Zeit.min(zeiten, format);

      expect(min.toString()).toBe('2000-01-01');
    });

    it('returns itself when the only one Zeit given', () => {
      expect.assertions(1);

      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [Zeit.ofString('2000-01-01', format)];

      const min: Zeit = Zeit.min(zeiten, format);

      expect(min).toBe(zeiten[0]);
    });

    it('throws ZeitError when empty array given', () => {
      expect.assertions(1);

      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [];

      expect(() => {
        Zeit.min(zeiten, format);
      }).toThrow(ZeitError);
    });
  });

  describe('validate', () => {
    it('returns true when the string is suitable date for format', () => {
      expect.assertions(2);

      expect(Zeit.validate('2000-01-01', 'YYYY-MM-DD')).toBe(true);
      expect(Zeit.validate('2000-01-01 01:02:03', 'YYYY-MM-DD HH:mm:ss')).toBe(true);
    });

    it('returns false when the string is not suitable for format', () => {
      expect.assertions(2);

      expect(Zeit.validate('2000-01-01', 'YYYY-MM-DD HH:mm:ss')).toBe(false);
      expect(Zeit.validate('2000-01-01 01:02:03', 'YYYY-MM-DD')).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns dayjs result itself', () => {
      expect.assertions(3);

      expect(Zeit.ofString('2000-01-01', 'YYYY-MM-DD').isValid()).toBe(true);
      expect(Zeit.ofString('2000-01-01 01:02:03', 'YYYY-MM-DD HH:mm:ss').isValid()).toBe(true);
      expect(Zeit.of(dayjs('2000-YY-01 YY:02:03', 'YYYY-MM-DD', true), 'YYYY-MM-DD').isValid()).toBe(false);
    });
  });

  describe('isBefore', () => {
    it('returns true if the value is before than the other', () => {
      expect.assertions(3);

      const zeit1: Zeit = Zeit.ofString('2000-01-02', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-03', 'YYYY-MM-DD');
      const zeit3: Zeit = Zeit.ofString('2000-01-04', 'YYYY-MM-DD');

      expect(zeit2.isBefore(zeit1)).toBe(false);
      expect(zeit2.isBefore(zeit2)).toBe(false);
      expect(zeit2.isBefore(zeit3)).toBe(true);
    });
  });

  describe('isAfter', () => {
    it('returns true if the value is after than the other', () => {
      expect.assertions(3);

      const zeit1: Zeit = Zeit.ofString('2000-01-02', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-03', 'YYYY-MM-DD');
      const zeit3: Zeit = Zeit.ofString('2000-01-04', 'YYYY-MM-DD');

      expect(zeit2.isAfter(zeit1)).toBe(true);
      expect(zeit2.isAfter(zeit2)).toBe(false);
      expect(zeit2.isAfter(zeit3)).toBe(false);
    });
  });

  describe('past', () => {
    it('goes back by second', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'second');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-12-31 23:59:55');
    });

    it('goes back by minute', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'minute');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-12-31 23:55:00');
    });

    it('goes back by hour', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'hour');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-12-31 19:00:00');
    });

    it('goes back by day', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'day');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-12-27 00:00:00');
    });

    it('goes back by week', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'week');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-11-27 00:00:00');
    });

    it('goes back by month', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'month');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-08-01 00:00:00');
    });

    it('goes back by year', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'year');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1995-01-01 00:00:00');
    });
  });

  describe('future', () => {
    it('goes forward by second', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'second');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-01-01 00:00:05');
    });

    it('goes forward by minute', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'minute');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-01-01 00:05:00');
    });

    it('goes forward by hour', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'hour');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-01-01 05:00:00');
    });

    it('goes forward by day', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'day');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-01-06 00:00:00');
    });

    it('goes forward by week', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'week');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-02-05 00:00:00');
    });

    it('goes forward by month', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'month');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-06-01 00:00:00');
    });

    it('goes forward by year', () => {
      expect.assertions(2);

      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'year');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2005-01-01 00:00:00');
    });
  });

  describe('equals', () => {
    it('returns true if they are the same instance', () => {
      expect.assertions(1);

      const zeit1: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');

      expect(zeit1.equals(zeit1)).toBe(true);
    });

    it('returns false if different instance given', () => {
      expect.assertions(1);

      const zeit1: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');

      expect(zeit1.equals(new MockValueObject('2000-01-01'))).toBe(false);
    });

    it('returns true if all the properties are the same', () => {
      expect.assertions(2);

      const zeit1: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-02', 'YYYY-MM-DD');
      const zeit3: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');

      expect(zeit1.equals(zeit2)).toBe(false);
      expect(zeit1.equals(zeit3)).toBe(true);
    });

    it('returns false if the formats are not the same', () => {
      expect.assertions(2);

      const zeit1: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');

      expect(zeit1.equals(zeit1)).toBe(true);
      expect(zeit1.equals(zeit2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('would like with shorthand format', () => {
      expect.assertions(4);

      expect(Zeit.ofString('2000-01-01', 'YYYY-MM-DD').toString()).toBe('2000-01-01');
      expect(Zeit.ofString('2001-01-01', 'YYYY-MM-DD').toString()).toBe('2001-01-01');
      expect(Zeit.ofString('2000-02-01', 'YYYY-MM-DD').toString()).toBe('2000-02-01');
      expect(Zeit.ofString('2000-01-03', 'YYYY-MM-DD').toString()).toBe('2000-01-03');
    });

    it('would like with longhand format', () => {
      expect.assertions(6);

      expect(Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('2000-01-01 00:00:00');
      expect(Zeit.ofString('3000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('3000-01-01 00:00:00');
      expect(Zeit.ofString('2000-01-05 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('2000-01-05 00:00:00');
      expect(Zeit.ofString('2000-01-01 06:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('2000-01-01 06:00:00');
      expect(Zeit.ofString('2000-01-01 00:07:00', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('2000-01-01 00:07:00');
      expect(Zeit.ofString('2000-01-01 00:00:08', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('2000-01-01 00:00:08');
    });

    it('would like shorthand format when it is going to be string', () => {
      expect.assertions(6);

      expect(Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString('YYYY-MM-DD')).toBe('2000-01-01');
      expect(Zeit.ofString('3000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString('YYYY-MM-DD')).toBe('3000-01-01');
      expect(Zeit.ofString('2000-01-05 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString('YYYY-MM-DD')).toBe('2000-01-05');
      expect(Zeit.ofString('2000-01-01 06:00:00', 'YYYY-MM-DD HH:mm:ss').toString('YYYY-MM-DD')).toBe('2000-01-01');
      expect(Zeit.ofString('2000-01-01 00:07:00', 'YYYY-MM-DD HH:mm:ss').toString('YYYY-MM-DD')).toBe('2000-01-01');
      expect(Zeit.ofString('2000-01-01 00:00:08', 'YYYY-MM-DD HH:mm:ss').toString('YYYY-MM-DD')).toBe('2000-01-01');
    });

    it('would like longhand format when it is going to be string', () => {
      expect.assertions(4);

      expect(Zeit.ofString('2000-01-01', 'YYYY-MM-DD').toString('YYYY-MM-DD HH:mm:ss')).toBe('2000-01-01 00:00:00');
      expect(Zeit.ofString('2001-01-01', 'YYYY-MM-DD').toString('YYYY-MM-DD HH:mm:ss')).toBe('2001-01-01 00:00:00');
      expect(Zeit.ofString('2000-02-01', 'YYYY-MM-DD').toString('YYYY-MM-DD HH:mm:ss')).toBe('2000-02-01 00:00:00');
      expect(Zeit.ofString('2000-01-03', 'YYYY-MM-DD').toString('YYYY-MM-DD HH:mm:ss')).toBe('2000-01-03 00:00:00');
    });
  });
});
