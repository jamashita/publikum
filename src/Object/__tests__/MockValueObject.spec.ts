import { MockValueObject } from '..';
import { Random } from '../../Random';

describe('MockValueObject', () => {
  describe('hashCode', () => {
    it('undefined', () => {
      expect(new MockValueObject<void>(undefined).hashCode()).toBe(new MockValueObject<void>(undefined).hashCode());
    });

    it('null', () => {
      expect(new MockValueObject<null>(null).hashCode()).toBe(new MockValueObject<null>(null).hashCode());
    });

    it('boolean', () => {
      expect(new MockValueObject<boolean>(true).hashCode()).toBe(new MockValueObject<boolean>(true).hashCode());
      expect(new MockValueObject<boolean>(false).hashCode()).toBe(new MockValueObject<boolean>(false).hashCode());
    });

    it('number', () => {
      for (let i: number = -500; i < 500; i++) {
        expect(new MockValueObject<number>(i).hashCode()).toBe(new MockValueObject<number>(i).hashCode());
      }
    });

    it('string', () => {
      for (let i: number = 0; i < 1000; i++) {
        const str: string = Random.string(i);
        expect(new MockValueObject<string>(str).hashCode()).toBe(new MockValueObject<string>(str).hashCode());
      }
    });

    it('object', () => {
      expect(new MockValueObject<object>({}).hashCode()).toBe(new MockValueObject<object>({}).hashCode());
      expect(new MockValueObject<object>({
        a: 1000
      }).hashCode()).toBe(new MockValueObject<object>({
        a: 1000
      }).hashCode());
      expect(new MockValueObject<object>({
        a: 1000,
        b: 'étoile'
      }).hashCode()).toBe(new MockValueObject<object>({
        b: 'étoile',
        a: 1000
      }).hashCode());
      expect(new MockValueObject<object>({
        a: 1000,
        b: 'étoile',
        f: true
      }).hashCode()).toBe(new MockValueObject<object>({
        b: 'étoile',
        a: 1000,
        f: true
      }).hashCode());
    });
  });
});
