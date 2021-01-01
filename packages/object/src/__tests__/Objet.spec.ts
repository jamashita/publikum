import { Inconnu } from '@jamashita/publikum-type';
import { randomBytes } from 'crypto';
import { Objet } from '../Objet';

const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const random = (length: number): string => {
  const charLength: number = chars.length;

  return randomBytes(length).reduce<string>((p: string, i: number) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return `${p}${chars[i % charLength]!}`;
  }, '');
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

    it('describes string', () => {
      expect.assertions(100);

      for (let i: number = 0; i < 100; i++) {
        const str: string = random(40);

        expect(Objet.identify(str)).toBe(str);
      }
    });

    it('describes symbol', () => {
      expect.assertions(100);

      for (let i: number = 0; i < 100; i++) {
        const sym: symbol = Symbol(random(40));

        expect(Objet.identify(sym)).toBe(sym.toString());
      }
    });

    it('describes bigint', () => {
      expect.assertions(201);

      for (let i: bigint = -100n; i <= 100n; i++) {
        expect(Objet.identify(i)).toBe(`${i}`);
      }
    });

    it('describes object literal', () => {
      expect.assertions(2);

      expect(Objet.identify({})).toBe('[object Object]');

      const obj: Inconnu = {};

      for (let i: number = 0; i < 100; i++) {
        obj[random(40)] = random(40);
      }

      expect(Objet.identify(obj)).toBe('[object Object]');
    });

    it('describes object.create(null)', () => {
      expect.assertions(2);

      expect(Objet.identify(Object.create(null))).toBe('[object Object]');

      const obj: Inconnu = {};

      for (let i: number = 0; i < 100; i++) {
        obj[random(40)] = random(40);
      }

      expect(Objet.identify(obj)).toBe('[object Object]');
    });

    it('returns itself when it has toString()', () => {
      expect.assertions(100);

      for (let i: number = 0; i < 100; i++) {
        const str: string = random(40);

        expect(Objet.identify({
          toString(): string {
            return str;
          }
        })).toBe(str);
      }
    });
  });
});
