import { MockContent, MockNominative } from '@jamashita/publikum-object';
import { Nullable, Peek, Predicate } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';
import { MockAddress } from '../Mock/MockAddress';

describe('AAddress', () => {
  describe('iterator', () => {
    it('normal case', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const values: Array<MockNominative<number>> = [noun1, noun2];

      const nouns: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2])
      );

      let i: number = 0;

      for (const noun of nouns) {
        expect(noun.getValue()).toBe(values[i]);
        i++;
      }
    });
  });

  describe('get', () => {
    it('always returns Absent', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);

      const nouns1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set());
      const nouns2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set([noun1]));

      expect(nouns1.size()).toBe(0);
      expect(nouns2.get()).toBeNull();
      expect(nouns2.size()).toBe(1);
      expect(nouns2.get()).toBeNull();
    });
  });

  describe('contains', () => {
    it('returns true if the elements exists', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(2);

      const nouns: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2])
      );

      expect(nouns.contains(noun1)).toBe(true);
      expect(nouns.contains(noun2)).toBe(true);
      expect(nouns.contains(noun3)).toBe(false);
      expect(nouns.contains(noun4)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2])
      );
      const nouns2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set());

      expect(nouns1.isEmpty()).toBe(false);
      expect(nouns2.isEmpty()).toBe(true);
    });
  });

  describe('forEach', () => {
    it('normal case', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const elements: Array<MockNominative<number>> = [noun1, noun2, noun3];

      const nouns: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set(elements));

      expect(nouns.size()).toBe(elements.length);
      let i: number = 0;

      nouns.forEach((noun: MockNominative<number>) => {
        expect(noun).toBe(elements[i]);
        i++;
      });
    });

    it('can cancel iteration', () => {
      expect.assertions(5);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const peeks: MockAddress<MockContent<Peek>> = new MockAddress<MockContent<Peek>>(
        new Set<MockContent<Peek>>([
          new MockContent<Peek>(() => {
            spy1();
          }),
          new MockContent<Peek>(() => {
            spy2();
          }),
          new MockContent<Peek>(() => {
            spy3();
          }),
          new MockContent<Peek>(() => {
            spy4();
          }),
          new MockContent<Peek>(() => {
            spy5();
          })
        ])
      );

      let i: number = 0;

      peeks.forEach((peek: MockContent<Peek>, _: void, cancel: Peek) => {
        peek.get()();

        if (i === 2) {
          cancel();
        }
        i++;
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
      expect(spy5.called).toBe(false);
    });
  });

  describe('find', () => {
    it('normal case', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2, noun3, noun4])
      );

      const found1: Nullable<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        return mock.get() === 1;
      });
      const found2: Nullable<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        return mock.get() === 2;
      });
      const found3: Nullable<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const found4: Nullable<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        return mock.get() > 1000;
      });

      expect(found1).toBe(noun1);
      expect(found2).toBe(noun2);
      expect(found3).toBe(noun2);
      expect(found4).toBeNull();
    });
  });

  describe('every', () => {
    it('normal case', () => {
      expect.assertions(1);

      const noun1: MockNominative<number> = new MockNominative<number>(2);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);

      const nouns: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2, noun3, noun4])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      };

      const every: boolean = nouns.every(predicate);

      expect(every).toBe(true);
    });

    it('if one of them are not satisfied, returns false', () => {
      expect.assertions(6);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);
      const noun5: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2, noun3, noun4])
      );
      const nouns2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun2, noun1, noun3, noun4])
      );
      const nouns3: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun2, noun3, noun1, noun4])
      );
      const nouns4: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun2, noun3, noun4, noun1])
      );
      const nouns5: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun5, noun3, noun4])
      );
      const nouns6: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2, noun5, noun4])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
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
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(2);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);

      const nouns: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2, noun3, noun4])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      };

      const some1: boolean = nouns.some(predicate);
      const some2: boolean = nouns.some(predicate);

      expect(some1).toBe(true);
      expect(some2).toBe(true);
    });

    it('if none of them are not satisfied, returns false', () => {
      expect.assertions(5);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);
      const noun5: MockNominative<number> = new MockNominative<number>(10);

      const nouns1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2, noun3, noun4])
      );
      const nouns2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun2, noun1, noun3, noun4])
      );
      const nouns3: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun2, noun3, noun1, noun4])
      );
      const nouns4: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun2, noun3, noun4, noun1])
      );
      const nouns5: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun2, noun3, noun4, noun5])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 1;
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
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set([noun1]));
      const nouns2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2])
      );

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(false);
    });

    it('returns true even if the sequence is different', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun2, noun1])
      );
      const nouns2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2])
      );

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(true);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2])
      );
      const nouns2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2])
      );

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2, noun3])
      );

      expect(nouns.toString()).toBe('1, 2, 3');
    });
  });

  describe('toSet', () => {
    it('normal case', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const elements: Array<MockNominative<number>> = [noun1, noun2, noun3];

      const nouns: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set(elements));
      const set: Set<MockNominative<number>> = nouns.toSet();

      expect(nouns.size()).toBe(set.size);
      for (let i: number = 0; i < set.size; i++) {
        expect(set.has(elements[i])).toBe(true);
      }
    });
  });

  describe('values', () => {
    it('normal case', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const values: Array<MockNominative<number>> = [noun1, noun2];

      const nouns: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set([noun1, noun2])
      );

      let i: number = 0;

      for (const noun of nouns.values()) {
        expect(noun.get()).toBe(values[i].get());
        i++;
      }
    });
  });
});
