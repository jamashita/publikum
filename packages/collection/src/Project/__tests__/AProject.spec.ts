import { MockContent, MockNominative } from '@jamashita/publikum-object';
import { BinaryPredicate, Peek } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';

import { MockAProject } from '../Mock/MockAProject';

describe('AProject', () => {
  describe('iterator', () => {
    it('normal case', () => {
      const key1: MockNominative<string> = new MockNominative<string>('a');
      const key2: MockNominative<string> = new MockNominative<string>('d');
      const keys: Array<MockNominative<string>> = [key1, key2];
      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const values: Array<MockNominative<number>> = [value1, value2];

      const nouns: MockAProject<MockNominative<string>, MockNominative<number>> = new MockAProject<
        MockNominative<string>,
        MockNominative<number>
      >(
        new Map<MockNominative<string>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );

      let i: number = 0;

      for (const noun of nouns) {
        expect(noun.getKey()).toBe(keys[i]);
        expect(noun.getValue()).toBe(values[i]);
        i++;
      }
    });
  });

  describe('get', () => {
    it('returns Present instance at the correct key', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(1);

      const nouns1: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(new Map<MockNominative<number>, MockNominative<number>>());
      const nouns2: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]])
      );

      expect(nouns1.size()).toEqual(0);
      expect(nouns1.get(noun1)).toBe(null);
      expect(nouns1.get(noun2)).toBe(null);
      expect(nouns2.size()).toEqual(1);
      expect(nouns2.get(noun1)).toBe(noun2);
      expect(nouns2.get(noun2)).toBe(null);
      expect(nouns2.get(noun3)).toBe(noun2);
    });
  });

  describe('has', () => {
    it('returns true when the key exists', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(1);

      const nouns: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]])
      );

      expect(nouns.has(noun1)).toBe(true);
      expect(nouns.has(noun2)).toBe(false);
      expect(nouns.has(noun3)).toBe(true);
    });
  });

  describe('contains', () => {
    it('returns true when the value exists', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(2);

      const nouns: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]])
      );

      expect(nouns.contains(noun1)).toBe(false);
      expect(nouns.contains(noun2)).toBe(true);
      expect(nouns.contains(noun3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true when the value exists', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(new Map<MockNominative<number>, MockNominative<number>>());
      const nouns2: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]])
      );

      expect(nouns1.isEmpty()).toBe(true);
      expect(nouns2.isEmpty()).toBe(false);
    });
  });

  describe('forEach', () => {
    it('returns true when the value exists', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(2);
      const noun4: MockNominative<number> = new MockNominative<number>(3);
      const elements: Array<[MockNominative<number>, MockNominative<number>]> = [
        [noun1, noun2],
        [noun3, noun4]
      ];

      const nouns: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(new Map<MockNominative<number>, MockNominative<number>>(elements));

      expect(nouns.size()).toBe(elements.length);
      let i: number = 0;

      nouns.forEach((value: MockNominative<number>, key: MockNominative<number>) => {
        expect(key).toBe(elements[i][0]);
        expect(value).toBe(elements[i][1]);
        i++;
      });
    });

    it('can cancel iteration', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const peeks: MockAProject<MockNominative<number>, MockContent<Peek>> = new MockAProject<
        MockNominative<number>,
        MockContent<Peek>
      >(
        new Map<MockNominative<number>, MockContent<Peek>>([
          [
            new MockNominative<number>(0),
            new MockContent<Peek>(() => {
              spy1();
            })
          ],
          [
            new MockNominative<number>(1),
            new MockContent<Peek>(() => {
              spy2();
            })
          ],
          [
            new MockNominative<number>(2),
            new MockContent<Peek>(() => {
              spy3();
            })
          ],
          [
            new MockNominative<number>(4),
            new MockContent<Peek>(() => {
              spy4();
            })
          ],
          [
            new MockNominative<number>(5),
            new MockContent<Peek>(() => {
              spy5();
            })
          ]
        ])
      );

      peeks.forEach((peek: MockContent<Peek>, index: MockNominative<number>, cancel: Peek) => {
        peek.get()();

        if (index.get() === 2) {
          cancel();
        }
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
      expect(spy5.called).toBe(false);
    });
  });

  describe('every', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(3);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(4);
      const noun5: MockNominative<number> = new MockNominative<number>(9);
      const noun6: MockNominative<number> = new MockNominative<number>(6);
      const elements: Array<[MockNominative<number>, MockNominative<number>]> = [
        [noun1, noun2],
        [noun3, noun4],
        [noun5, noun6]
      ];

      const nouns: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(new Map<MockNominative<number>, MockNominative<number>>(elements));

      const every1: boolean = nouns.every((_: MockNominative<number>, key: MockNominative<number>) => {
        return key.get() % 3 === 0;
      });
      const every2: boolean = nouns.every((value: MockNominative<number>) => {
        return value.get() % 2 === 0;
      });

      expect(every1).toBe(true);
      expect(every2).toBe(true);
    });

    it('if one of them are not satisfied, returns false', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);
      const noun6: MockNominative<number> = new MockNominative<number>(1);
      const noun7: MockNominative<number> = new MockNominative<number>(4);
      const noun8: MockNominative<number> = new MockNominative<number>(6);
      const noun9: MockNominative<number> = new MockNominative<number>(8);
      const noun0: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun6],
          [noun2, noun7],
          [noun3, noun8],
          [noun4, noun9]
        ])
      );
      const nouns2: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun7],
          [noun2, noun6],
          [noun3, noun8],
          [noun4, noun9]
        ])
      );
      const nouns3: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun7],
          [noun2, noun8],
          [noun3, noun6],
          [noun4, noun9]
        ])
      );
      const nouns4: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun7],
          [noun2, noun8],
          [noun3, noun9],
          [noun4, noun6]
        ])
      );
      const nouns5: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun6],
          [noun2, noun0],
          [noun3, noun8],
          [noun4, noun9]
        ])
      );
      const nouns6: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun6],
          [noun2, noun7],
          [noun3, noun0],
          [noun4, noun9]
        ])
      );

      const predicate: BinaryPredicate<MockNominative<number>, MockNominative<number>> = (
        value: MockNominative<number>
      ) => {
        return value.get() % 2 === 0;
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
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(2);
      const noun4: MockNominative<number> = new MockNominative<number>(4);
      const noun5: MockNominative<number> = new MockNominative<number>(3);
      const noun6: MockNominative<number> = new MockNominative<number>(6);
      const elements: Array<[MockNominative<number>, MockNominative<number>]> = [
        [noun1, noun2],
        [noun3, noun4],
        [noun5, noun6]
      ];

      const nouns: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(new Map<MockNominative<number>, MockNominative<number>>(elements));

      const predicate: BinaryPredicate<MockNominative<number>, MockNominative<number>> = (
        value: MockNominative<number>
      ) => {
        return value.get() % 2 === 0;
      };

      const some1: boolean = nouns.some(predicate);
      const some2: boolean = nouns.some(predicate);

      expect(some1).toBe(true);
      expect(some2).toBe(true);
    });

    it('if none of them are not satisfied, returns false', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);
      const noun6: MockNominative<number> = new MockNominative<number>(1);
      const noun7: MockNominative<number> = new MockNominative<number>(4);
      const noun8: MockNominative<number> = new MockNominative<number>(6);
      const noun9: MockNominative<number> = new MockNominative<number>(8);
      const noun0: MockNominative<number> = new MockNominative<number>(10);

      const nouns1: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun6],
          [noun2, noun7],
          [noun3, noun8],
          [noun4, noun9]
        ])
      );
      const nouns2: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun7],
          [noun2, noun6],
          [noun3, noun8],
          [noun4, noun9]
        ])
      );
      const nouns3: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun7],
          [noun2, noun8],
          [noun3, noun6],
          [noun4, noun9]
        ])
      );
      const nouns4: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun7],
          [noun2, noun8],
          [noun3, noun9],
          [noun4, noun6]
        ])
      );
      const nouns5: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun7],
          [noun2, noun8],
          [noun3, noun9],
          [noun4, noun0]
        ])
      );

      const predicate: BinaryPredicate<MockNominative<number>, MockNominative<number>> = (
        value: MockNominative<number>
      ) => {
        return value.get() % 2 === 1;
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
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]])
      );
      const nouns2: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun2],
          [noun3, noun4]
        ])
      );

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(false);
    });

    it('returns false if the values are different', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun2],
          [noun3, noun3]
        ])
      );
      const nouns2: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun2],
          [noun3, noun4]
        ])
      );

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(false);
    });

    it('returns true even if the sequence is different', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun3, noun4],
          [noun1, noun2]
        ])
      );
      const nouns2: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun2],
          [noun3, noun4]
        ])
      );

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(true);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun2],
          [noun3, noun4]
        ])
      );
      const nouns2: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun2],
          [noun3, noun4]
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
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun2],
          [noun3, noun4]
        ])
      );

      expect(nouns.toString()).toBe('{1: 2}, {3: 4}');
    });
  });

  describe('toMap', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);
      const elements: Array<[MockNominative<number>, MockNominative<number>]> = [
        [noun1, noun2],
        [noun3, noun4]
      ];

      const nouns: MockAProject<MockNominative<number>, MockNominative<number>> = new MockAProject<
        MockNominative<number>,
        MockNominative<number>
      >(new Map<MockNominative<number>, MockNominative<number>>(elements));
      const map: Map<MockNominative<number>, MockNominative<number>> = nouns.toMap();

      let i: number = 0;

      expect(nouns.size()).toBe(map.size);
      nouns.forEach((value: MockNominative<number>, key: MockNominative<number>) => {
        expect(key).toBe(elements[i][0]);
        expect(value).toBe(elements[i][1]);
        i++;
      });
    });
  });
});
