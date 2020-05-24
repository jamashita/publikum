import { Absent } from '../Absent';
import { Planck } from '../Planck';
import { Present } from '../Present';

describe('Planck', () => {
  describe('maybe', () => {
    it('when null and undefined given, generates Absent instance', () => {
      expect(Planck.maybe(1)).toBeInstanceOf(Present);
      expect(Planck.maybe(0)).toBeInstanceOf(Present);
      expect(Planck.maybe('a')).toBeInstanceOf(Present);
      expect(Planck.maybe('')).toBeInstanceOf(Present);
      expect(Planck.maybe(true)).toBeInstanceOf(Present);
      expect(Planck.maybe(false)).toBeInstanceOf(Present);
      expect(Planck.maybe(null)).toBeInstanceOf(Absent);
      expect(Planck.maybe(undefined)).toBeInstanceOf(Absent);
    });

    it('when instances of Present given, returns themselves', () => {
      const present1: Present<number> = Present.of<number>(1);
      const present2: Present<number> = Present.of<number>(0);
      const present3: Present<number> = Present.of<number>(-1);
      const present4: Present<string> = Present.of<string>('');
      const present5: Present<string> = Present.of<string>('1');
      const present6: Present<boolean> = Present.of<boolean>(true);
      const present7: Present<boolean> = Present.of<boolean>(false);

      expect(Planck.maybe(present1)).toBe(present1);
      expect(Planck.maybe(present2)).toBe(present2);
      expect(Planck.maybe(present3)).toBe(present3);
      expect(Planck.maybe(present4)).toBe(present4);
      expect(Planck.maybe(present5)).toBe(present5);
      expect(Planck.maybe(present6)).toBe(present6);
      expect(Planck.maybe(present7)).toBe(present7);
    });

    it('when instances of Absent given, returns themselves', () => {
      const absent: Absent<number> = Absent.of<number>();

      expect(Planck.maybe(absent)).toBe(absent);
    });
  });
});
