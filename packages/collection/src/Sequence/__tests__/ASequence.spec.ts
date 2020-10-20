import { MockContent, MockNominative, MockValueObject } from '@jamashita/publikum-object';
import { Nullable, Peek } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';
import { MockSequence } from '../Mock/MockSequence';

describe('ASequence', () => {
  describe('iterator', () => {
    it('normal case', () => {
      expect.assertions(4);

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2)
      ]);

      let i: number = 0;

      for (const noun of nouns) {
        expect(noun.getKey()).toBe(i);
        expect(noun.getValue().get()).toBe(nouns.get(i)?.get());
        i++;
      }
    });
  });

  describe('get', () => {
    it('returns its value at the correct index', () => {
      expect.assertions(4);

      const nounArray: Array<MockNominative<number>> = [
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ];

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>(nounArray);

      expect(nouns.size()).toBe(nounArray.length);
      for (let i: number = 0; i < nouns.size(); i++) {
        expect(nouns.get(i)).toBe(nounArray[i]);
      }
    });

    it('returns null instance at out of index', () => {
      expect.assertions(3);

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);

      expect(nouns.size()).toBe(3);
      expect(nouns.get(-1)).toBeNull();
      expect(nouns.get(3)).toBeNull();
    });
  });

  describe('contains', () => {
    it('returns true if the element exists', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(2);

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([noun1, noun2]);

      expect(nouns.contains(noun1)).toBe(true);
      expect(nouns.contains(noun2)).toBe(true);
      expect(nouns.contains(noun3)).toBe(false);
      expect(nouns.contains(noun4)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      expect.assertions(2);

      const nouns1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2)
      ]);
      const nouns2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([]);

      expect(nouns1.isEmpty()).toBe(false);
      expect(nouns2.isEmpty()).toBe(true);
    });
  });

  describe('forEach', () => {
    it('normal case', () => {
      expect.assertions(4);

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);

      expect(nouns.size()).toBe(3);
      nouns.forEach((noun: MockNominative<number>, index: number) => {
        expect(nouns.get(index)).toBe(noun);
      });
    });

    it('can cancel iteration', () => {
      expect.assertions(5);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const peeks: MockSequence<MockContent<Peek>> = new MockSequence<MockContent<Peek>>([
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
      ]);

      peeks.forEach((peek: MockContent<Peek>, index: number, cancel: Peek) => {
        peek.get()();

        if (index === 2) {
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

  describe('find', () => {
    it('normal case', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);

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

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(2),
        new MockNominative<number>(4),
        new MockNominative<number>(6),
        new MockNominative<number>(8)
      ]);

      const every: boolean = nouns.every((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });

      expect(every).toBe(true);
    });

    it('if one of them are not satisfied, returns false', () => {
      expect.assertions(6);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);
      const noun5: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);
      const nouns2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun2,
        noun1,
        noun3,
        noun4
      ]);
      const nouns3: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun2,
        noun3,
        noun1,
        noun4
      ]);
      const nouns4: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun2,
        noun3,
        noun4,
        noun1
      ]);
      const nouns5: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun1,
        noun5,
        noun3,
        noun4
      ]);
      const nouns6: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun1,
        noun2,
        noun5,
        noun4
      ]);

      const every1: boolean = nouns1.every((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const every2: boolean = nouns2.every((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const every3: boolean = nouns3.every((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const every4: boolean = nouns4.every((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const every5: boolean = nouns5.every((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const every6: boolean = nouns6.every((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });

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

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(2),
        new MockNominative<number>(4),
        new MockNominative<number>(6),
        new MockNominative<number>(8)
      ]);

      const some1: boolean = nouns.some((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const some2: boolean = nouns.some((mock: MockNominative<number>) => {
        return mock.get() === 2;
      });

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

      const nouns1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);
      const nouns2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun2,
        noun1,
        noun3,
        noun4
      ]);
      const nouns3: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun2,
        noun3,
        noun1,
        noun4
      ]);
      const nouns4: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun2,
        noun3,
        noun4,
        noun1
      ]);
      const nouns5: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        noun2,
        noun3,
        noun4,
        noun5
      ]);

      const some1: boolean = nouns1.some((mock: MockNominative<number>) => {
        return mock.get() % 2 === 1;
      });
      const some2: boolean = nouns2.some((mock: MockNominative<number>) => {
        return mock.get() % 2 === 1;
      });
      const some3: boolean = nouns3.some((mock: MockNominative<number>) => {
        return mock.get() % 2 === 1;
      });
      const some4: boolean = nouns4.some((mock: MockNominative<number>) => {
        return mock.get() % 2 === 1;
      });
      const some5: boolean = nouns5.some((mock: MockNominative<number>) => {
        return mock.get() % 2 === 1;
      });

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

      const nouns1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([noun1]);
      const nouns2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([noun1, noun2]);

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(false);
    });

    it('returns false when the different class instance given', () => {
      expect.assertions(1);

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([]);

      expect(nouns.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns false if the sequence is different', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([noun2, noun1]);
      const nouns2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([noun1, noun2]);

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([noun1, noun2]);
      const nouns2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([noun1, noun2]);

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);

      expect(nouns.toString()).toBe('1, 2, 3');
    });
  });

  describe('toArray', () => {
    it('normal case', () => {
      expect.assertions(4);

      const nounArray: Array<MockNominative<number>> = [
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ];

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>(nounArray);

      expect(nouns.size()).toBe(nounArray.length);
      for (let i: number = 0; i < nounArray.length; i++) {
        expect(nouns.get(i)).toBe(nounArray[i]);
      }
    });

    it('does not return the array itself', () => {
      expect.assertions(1);

      const nounArray: Array<MockNominative<number>> = [
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ];

      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>(nounArray);

      expect(nouns.toArray()).not.toBe(nounArray);
    });
  });

  describe('values', () => {
    it('normal case', () => {
      expect.assertions(2);

      const nominatives: Array<MockNominative<number>> = [
        new MockNominative<number>(1),
        new MockNominative<number>(2)
      ];
      const nouns: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>(nominatives);

      let i: number = 0;

      for (const noun of nouns.values()) {
        expect(noun).toBe(nominatives[i]);
        i++;
      }
    });
  });
});
