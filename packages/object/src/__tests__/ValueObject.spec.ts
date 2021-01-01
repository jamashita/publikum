import { randomBytes } from 'crypto';
import { MockValueObject } from '../Mock/MockValueObject';

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

describe('ValueObject', () => {
  describe('hashCode', () => {
    it('generates same ones if all the properties are the same', async () => {
      expect.assertions(10000);

      const promises: Array<Promise<string>> = sequence(10000).map<Promise<string>>((i: number) => {
        return random(i);
      });
      const values: Array<string> = await Promise.all(promises);

      values.forEach((str: string) => {
        expect(new MockValueObject(str).hashCode()).toBe(new MockValueObject(str).hashCode());
      });
    }, 10_000);
  });
});
