import { Inconnu } from '@jamashita/publikum-type';
import { randomBytes } from 'crypto';
import { Objet } from '../Objet';

const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const sequence = (last: number): Array<number> => {
  return Array.from(Array(last).keys());
};

const random = (length: number): Promise<string> => {
  const charLength: number = chars.length;

  return new Promise((resolve: (value: (string)) => void, reject: (reason?: unknown) => void) => {
    randomBytes(length, (err: Error | null, buf: Buffer) => {
      if (err !== null) {
        reject(err);

        return;
      }

      const str: string = buf.reduce<string>((p: string, i: number) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return `${p}${chars[i % charLength]!}`;
      }, '');

      resolve(str);
    });
  });
};

describe('Objet', () => {
  describe('identify', () => {
    it('describes undefined', () => {
      expect.assertions(1);

      expect(Objet.identify(undefined)).toBe('undefined');
    });

    it('describes null', () => {
      expect.assertions(1);

      expect(Objet.identify(null)).toBe('null');
    });

    it('describes boolean', () => {
      expect.assertions(2);

      expect(Objet.identify(false)).toBe('false');
      expect(Objet.identify(true)).toBe('true');
    });

    it('describes number', () => {
      expect.assertions(201);

      for (let i: number = -100; i <= 100; i++) {
        expect(Objet.identify(i)).toBe(`${i}`);
      }
    });

    it('describes string', async () => {
      expect.assertions(100);

      for (let i: number = 0; i < 100; i++) {
        // eslint-disable-next-line no-await-in-loop
        const str: string = await random(40);

        expect(Objet.identify(str)).toBe(str);
      }
    }, 10_000);

    it('describes symbol', async () => {
      expect.assertions(100);

      for (let i: number = 0; i < 100; i++) {
        // eslint-disable-next-line no-await-in-loop
        const sym: symbol = Symbol(await random(40));

        expect(Objet.identify(sym)).toBe(sym.toString());
      }
    }, 10_000);

    it('describes bigint', () => {
      expect.assertions(201);

      for (let i: bigint = -100n; i <= 100n; i++) {
        expect(Objet.identify(i)).toBe(`${i}`);
      }
    });

    it('describes object literal', async () => {
      expect.assertions(2);

      expect(Objet.identify({})).toBe('[object Object]');

      const obj: Inconnu = {};

      const promises: Array<Promise<[string, string]>> = sequence(100).map<Promise<[string, string]>>(async (i: number) => {
        // eslint-disable-next-line no-await-in-loop
        return [await random(i), await random(i)];
      });
      const kv: Array<[string, string]> = await Promise.all(promises);

      kv.forEach(([key, value]: [string, string]) => {
        obj[key] = value;
      });

      expect(Objet.identify(obj)).toBe('[object Object]');
    }, 10_000);

    it('describes object.create(null)', async () => {
      expect.assertions(2);

      expect(Objet.identify(Object.create(null))).toBe('[object Object]');

      const obj: Inconnu = {};

      const promises: Array<Promise<[string, string]>> = sequence(100).map<Promise<[string, string]>>(async (i: number) => {
        // eslint-disable-next-line no-await-in-loop
        return [await random(i), await random(i)];
      });
      const kv: Array<[string, string]> = await Promise.all(promises);

      kv.forEach(([key, value]: [string, string]) => {
        obj[key] = value;
      });

      expect(Objet.identify(obj)).toBe('[object Object]');
    }, 10_000);

    it('returns itself when it has toString()', async () => {
      expect.assertions(100);

      for (let i: number = 0; i < 100; i++) {
        // eslint-disable-next-line no-await-in-loop
        const str: string = await random(40);

        expect(Objet.identify({
          toString(): string {
            return str;
          }
        })).toBe(str);
      }
    }, 10_000);
  });
});
