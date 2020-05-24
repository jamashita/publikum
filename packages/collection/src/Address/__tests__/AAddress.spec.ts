import { Absent, Quantum } from '@publikum/monad';
import { MockNominative } from '@publikum/object';
import { Predicate } from '@publikum/type';

import { MockAAddress } from '../Mock/MockAAddress';

describe('AAddress', () => {
  describe('get', () => {
    it('always returns Absent', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);

      const nouns1: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(new Set());
      const nouns2: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(new Set([noun1]));

      expect(nouns1.size()).toBe(0);
      expect(nouns2.get()).toBeInstanceOf(Absent);
      expect(nouns2.size()).toBe(1);
      expect(nouns2.get()).toBeInstanceOf(Absent);
    });
  });

  describe('contains', () => {
    it('returns true if the elements exists', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(2);

      const nouns: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2
        ])
      );

      expect(nouns.contains(noun1)).toBe(true);
      expect(nouns.contains(noun2)).toBe(true);
      expect(nouns.contains(noun3)).toBe(false);
      expect(nouns.contains(noun4)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2
        ])
      );
      const nouns2: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(new Set());

      expect(nouns1.isEmpty()).toBe(false);
      expect(nouns2.isEmpty()).toBe(true);
    });
  });

  describe('forEach', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      // prettier-ignore
      const elements: Array<MockNominative<number>> = [
        noun1,
        noun2,
        noun3
      ];

      const nouns: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(new Set(elements));

      expect(nouns.size()).toBe(elements.length);
      let i: number = 0;

      nouns.forEach((noun: MockNominative<number>) => {
        expect(noun).toBe(elements[i]);
        i++;
      });
    });
  });

  describe('find', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2,
          noun3,
          noun4
        ])
      );

      const found1: Quantum<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() === 1) {
          return true;
        }

        return false;
      });
      const found2: Quantum<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() === 2) {
          return true;
        }

        return false;
      });
      const found3: Quantum<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });
      const found4: Quantum<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() > 1000) {
          return true;
        }

        return false;
      });

      expect(found1.isPresent()).toBe(true);
      expect(found1.get()).toBe(noun1);
      expect(found2.isPresent()).toBe(true);
      expect(found2.get()).toBe(noun2);
      expect(found3.isPresent()).toBe(true);
      expect(found3.get()).toBe(noun2);
      expect(found4.isAbsent()).toBe(true);
    });
  });

  describe('every', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(2);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);

      const nouns: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2,
          noun3,
          noun4
        ])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      };

      const every: boolean = nouns.every(predicate);

      expect(every).toBe(true);
    });

    it('if one of them are not satisfied, returns false', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);
      const noun5: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2,
          noun3,
          noun4
        ])
      );
      const nouns2: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun2,
          noun1,
          noun3,
          noun4
        ])
      );
      const nouns3: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun2,
          noun3,
          noun1,
          noun4
        ])
      );
      const nouns4: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun2,
          noun3,
          noun4,
          noun1
        ])
      );
      const nouns5: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun5,
          noun3,
          noun4
        ])
      );
      const nouns6: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2,
          noun5,
          noun4
        ])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      };

      const every1: boolean = nouns1.every(predicate);
      const every2: boolean = nouns2.every(predicate);
      const every3: boolean = nouns3.every(predicate);
      const every4: boolean = nouns4.every(predicate);
      const every5: boolean = nouns5.every(predicate);
      const every6: boolean = nouns6.every(predicate);

      expect(every1).toBe(false);
      expect(every2).toBe(false);
      expect(every3).toBe(false);
      expect(every4).toBe(false);
      expect(every5).toBe(false);
      expect(every6).toBe(false);
    });
  });

  describe('some', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(2);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);

      const nouns: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2,
          noun3,
          noun4
        ])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      };

      const some1: boolean = nouns.some(predicate);
      const some2: boolean = nouns.some(predicate);

      expect(some1).toBe(true);
      expect(some2).toBe(true);
    });

    it('if none of them are not satisfied, returns false', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);
      const noun5: MockNominative<number> = new MockNominative<number>(10);

      const nouns1: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2,
          noun3,
          noun4
        ])
      );
      const nouns2: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun2,
          noun1,
          noun3,
          noun4
        ])
      );
      const nouns3: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun2,
          noun3,
          noun1,
          noun4
        ])
      );
      const nouns4: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun2,
          noun3,
          noun4,
          noun1
        ])
      );
      const nouns5: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun2,
          noun3,
          noun4,
          noun5
        ])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        if (mock.get() % 2 === 1) {
          return true;
        }

        return false;
      };

      const some1: boolean = nouns1.some(predicate);
      const some2: boolean = nouns2.some(predicate);
      const some3: boolean = nouns3.some(predicate);
      const some4: boolean = nouns4.some(predicate);
      const some5: boolean = nouns5.some(predicate);

      expect(some1).toBe(true);
      expect(some2).toBe(true);
      expect(some3).toBe(true);
      expect(some4).toBe(true);
      expect(some5).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(new Set([noun1]));
      const nouns2: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2
        ])
      );

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(false);
    });

    it('returns true even if the sequence is different', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun2,
          noun1
        ])
      );
      const nouns2: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2
        ])
      );

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(true);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2
        ])
      );
      const nouns2: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2
        ])
      );

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(
        // prettier-ignore
        new Set([
          noun1,
          noun2,
          noun3
        ])
      );

      expect(nouns.toString()).toBe('1, 2, 3');
    });
  });

  describe('toSet', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      // prettier-ignore
      const elements: Array<MockNominative<number>> = [
        noun1,
        noun2,
        noun3
      ];

      const nouns: MockAAddress<MockNominative<number>> = new MockAAddress<MockNominative<number>>(new Set(elements));
      const set: Set<MockNominative<number>> = nouns.toSet();

      expect(nouns.size()).toBe(set.size);
      for (let i: number = 0; i < set.size; i++) {
        expect(set.has(elements[i])).toBe(true);
      }
    });
  });
});