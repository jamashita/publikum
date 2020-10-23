import { randomBytes } from 'crypto';
import { MockValueObject } from '../Mock/MockValueObject';

const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const random = (length: number): string => {
  const charLength: number = chars.length;

  return randomBytes(length).reduce<string>((p: string, i: number) => {
    return p + chars[i % charLength];
  }, '');
};

describe('ValueObject', () => {
  describe('hashCode', () => {
    it('generates same ones if all the properties are the same', () => {
      expect.assertions(10000);

      for (let i: number = 0; i < 10000; i++) {
        const str: string = random(i);

        expect(new MockValueObject(str).hashCode()).toBe(new MockValueObject(str).hashCode());
      }
    });
  });
});
