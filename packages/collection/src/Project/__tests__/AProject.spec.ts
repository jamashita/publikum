import { MockContent, MockNominative, MockValueObject } from '@jamashita/publikum-object';
import { BinaryPredicate, Peek } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';
import { MockProject } from '../Mock/MockProject';

describe('AProject', () => {
  describe('iterator', () => {
    it('returns Pair<MockNominative<string>, MockNominative<number>>', () => {
      expect.assertions(4);

      const key1: MockNominative<string> = new MockNominative<string>('a');
      const key2: MockNominative<string> = new MockNominative<string>('d');
      const keys: Array<MockNominative<string>> = [key1, key2];

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const values: Array<MockNominative<number>> = [value1, value2];

      const project: MockProject<MockNominative<string>, MockNominative<number>> = new MockProject<MockNominative<string>,
        MockNominative<number>>(
        new Map<MockNominative<string>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );

      let i: number = 0;

      for (const key of project) {
        expect(key.getKey()).toBe(keys[i]);
        expect(key.getValue()).toBe(values[i]);
        i++;
      }
    });
  });

  describe('get', () => {
    it('returns value at the correct key', () => {
      expect.assertions(3);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(1);

      const value1: MockNominative<number> = new MockNominative<number>(2);

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value1]])
      );

      expect(project.size()).toBe(1);
      expect(project.get(key1)).toBe(value1);
      expect(project.get(key2)).toBe(value1);
    });

    it('returns null at incorrect keys', () => {
      expect.assertions(2);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value1]])
      );

      expect(project.size()).toBe(1);
      expect(project.get(key2)).toBeNull();
    });
  });

  describe('has', () => {
    it('returns false if the key does not exist', () => {
      expect.assertions(1);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value1]])
      );

      expect(project.has(key2)).toBe(false);
    });

    it('returns true if the key exists', () => {
      expect.assertions(2);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(1);

      const value1: MockNominative<number> = new MockNominative<number>(3);

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value1]])
      );

      expect(project.has(key1)).toBe(true);
      expect(project.has(key2)).toBe(true);
    });
  });

  describe('contains', () => {
    it('returns false if the value does not exist', () => {
      expect.assertions(1);

      const key1: MockNominative<number> = new MockNominative<number>(1);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(3);

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value1]])
      );

      expect(project.contains(value2)).toBe(false);
    });

    it('returns true if the value exists', () => {
      expect.assertions(2);

      const key1: MockNominative<number> = new MockNominative<number>(1);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value1]])
      );

      expect(project.contains(value1)).toBe(true);
      expect(project.contains(value2)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the values does not exist', () => {
      expect.assertions(2);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const value1: MockNominative<number> = new MockNominative<number>(2);

      const project1: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value1]])
      );
      const project2: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>()
      );

      expect(project1.isEmpty()).toBe(false);
      expect(project2.isEmpty()).toBe(true);
    });
  });

  describe('forEach', () => {
    it('calls back as much as the size of set', () => {
      expect.assertions(5);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(2);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(3);

      const kv: Array<[MockNominative<number>, MockNominative<number>]> = [
        [key1, value1],
        [key2, value2]
      ];

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>(kv)
      );
      let i: number = 0;

      expect(project.size()).toBe(kv.length);
      project.forEach((value: MockNominative<number>, key: MockNominative<number>) => {
        expect(key).toBe(kv[i][0]);
        expect(value).toBe(kv[i][1]);
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
      const peeks: MockProject<MockNominative<number>, MockContent<Peek>> = new MockProject<MockNominative<number>, MockContent<Peek>>(
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
    it('returns true if all the values are the same', () => {
      expect.assertions(2);

      const key1: MockNominative<number> = new MockNominative<number>(3);
      const key2: MockNominative<number> = new MockNominative<number>(6);
      const key3: MockNominative<number> = new MockNominative<number>(9);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);
      const value3: MockNominative<number> = new MockNominative<number>(6);

      const kv: Array<[MockNominative<number>, MockNominative<number>]> = [
        [key1, value1],
        [key2, value2],
        [key3, value3]
      ];

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>(kv)
      );

      const every1: boolean = project.every((_: MockNominative<number>, key: MockNominative<number>) => {
        return key.get() % 3 === 0;
      });
      const every2: boolean = project.every((value: MockNominative<number>) => {
        return value.get() % 2 === 0;
      });

      expect(every1).toBe(true);
      expect(every2).toBe(true);
    });

    it('if one of them are not satisfied, returns false', () => {
      expect.assertions(6);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(2);
      const key3: MockNominative<number> = new MockNominative<number>(3);
      const key4: MockNominative<number> = new MockNominative<number>(4);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(4);
      const value3: MockNominative<number> = new MockNominative<number>(6);
      const value4: MockNominative<number> = new MockNominative<number>(8);
      const value5: MockNominative<number> = new MockNominative<number>(3);

      const project1: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2],
          [key3, value3],
          [key4, value4]
        ])
      );
      const project2: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value2],
          [key2, value1],
          [key3, value3],
          [key4, value4]
        ])
      );
      const project3: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value2],
          [key2, value3],
          [key3, value1],
          [key4, value4]
        ])
      );
      const project4: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value2],
          [key2, value3],
          [key3, value4],
          [key4, value1]
        ])
      );
      const project5: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value5],
          [key3, value3],
          [key4, value4]
        ])
      );
      const project6: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2],
          [key3, value5],
          [key4, value4]
        ])
      );

      const predicate: BinaryPredicate<MockNominative<number>, MockNominative<number>> = (
        value: MockNominative<number>
      ) => {
        return value.get() % 2 === 0;
      };

      const every1: boolean = project1.every(predicate);
      const every2: boolean = project2.every(predicate);
      const every3: boolean = project3.every(predicate);
      const every4: boolean = project4.every(predicate);
      const every5: boolean = project5.every(predicate);
      const every6: boolean = project6.every(predicate);

      expect(every1).toBe(false);
      expect(every2).toBe(false);
      expect(every3).toBe(false);
      expect(every4).toBe(false);
      expect(every5).toBe(false);
      expect(every6).toBe(false);
    });
  });

  describe('some', () => {
    it('returns true if at least one of the values returns true', () => {
      expect.assertions(1);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(2);
      const key3: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);
      const value3: MockNominative<number> = new MockNominative<number>(6);

      const kv: Array<[MockNominative<number>, MockNominative<number>]> = [
        [key1, value1],
        [key2, value2],
        [key3, value3]
      ];

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>(kv)
      );

      const predicate: BinaryPredicate<MockNominative<number>, MockNominative<number>> = (value: MockNominative<number>) => {
        return value.get() % 2 === 0;
      };

      const some: boolean = project.some(predicate);

      expect(some).toBe(true);
    });

    it('returns false if none of the values are true', () => {
      expect.assertions(1);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(2);
      const key3: MockNominative<number> = new MockNominative<number>(3);
      const key4: MockNominative<number> = new MockNominative<number>(4);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);
      const value3: MockNominative<number> = new MockNominative<number>(6);
      const value4: MockNominative<number> = new MockNominative<number>(8);

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2],
          [key3, value3],
          [key4, value4]
        ])
      );

      const predicate: BinaryPredicate<MockNominative<number>, MockNominative<number>> = (value: MockNominative<number>) => {
        return value.get() % 2 === 1;
      };

      const some: boolean = project.some(predicate);

      expect(some).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true when the same instance given', () => {
      expect.assertions(1);

      const key: MockNominative<number> = new MockNominative<number>(1);

      const value: MockNominative<number> = new MockNominative<number>(2);

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key, value]])
      );

      expect(project.equals(project)).toBe(true);
    });

    it('returns false if the size is different', () => {
      expect.assertions(1);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);

      const project1: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value1]])
      );
      const project2: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );

      expect(project1.equals(project2)).toBe(false);
    });

    it('returns false when the different class instance given', () => {
      expect.assertions(1);

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>()
      );

      expect(project.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns false if the values are different', () => {
      expect.assertions(1);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);

      const project1: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value1]
        ])
      );
      const project2: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );

      expect(project1.equals(project2)).toBe(false);
    });

    it('returns false if the keys are different', () => {
      expect.assertions(1);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);
      const key3: MockNominative<number> = new MockNominative<number>(5);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);

      const project1: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );
      const project2: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key3, value2]
        ])
      );

      expect(project1.equals(project2)).toBe(false);
    });

    it('returns true even if the order is different', () => {
      expect.assertions(1);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);

      const project1: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key2, value2],
          [key1, value1]
        ])
      );
      const project2: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );

      expect(project1.equals(project2)).toBe(true);
    });

    it('returns true if the same and the order is the same', () => {
      expect.assertions(1);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);

      const project1: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );
      const project2: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );

      expect(project1.equals(project2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns key-value concatnated string', () => {
      expect.assertions(1);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );

      expect(project.toString()).toBe('{1: 2}, {3: 4}');
    });
  });

  describe('toMap', () => {
    it('returns its retaining shallow-copied map', () => {
      expect.assertions(5);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);
      const kv: Array<[MockNominative<number>, MockNominative<number>]> = [
        [key1, value1],
        [key2, value2]
      ];

      const project: MockProject<MockNominative<number>, MockNominative<number>> = new MockProject<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>(kv)
      );
      const map: Map<MockNominative<number>, MockNominative<number>> = project.toMap();
      let i: number = 0;

      expect(project.size()).toBe(map.size);
      project.forEach((value: MockNominative<number>, key: MockNominative<number>) => {
        expect(key).toBe(kv[i][0]);
        expect(value).toBe(kv[i][1]);
        i++;
      });
    });
  });

  describe('keys', () => {
    it('returns its retaining keys', () => {
      expect.assertions(2);

      const key1: MockNominative<string> = new MockNominative<string>('a');
      const key2: MockNominative<string> = new MockNominative<string>('d');
      const keys: Array<MockNominative<string>> = [key1, key2];

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const project: MockProject<MockNominative<string>, MockNominative<number>> = new MockProject<MockNominative<string>, MockNominative<number>>(
        new Map<MockNominative<string>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );

      let i: number = 0;

      for (const key of project.keys()) {
        expect(key).toBe(keys[i]);
        i++;
      }
    });
  });

  describe('values', () => {
    it('returns its retaining values', () => {
      expect.assertions(2);

      const key1: MockNominative<string> = new MockNominative<string>('a');
      const key2: MockNominative<string> = new MockNominative<string>('d');

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const values: Array<MockNominative<number>> = [value1, value2];

      const project: MockProject<MockNominative<string>, MockNominative<number>> = new MockProject<MockNominative<string>, MockNominative<number>>(
        new Map<MockNominative<string>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );

      let i: number = 0;

      for (const key of project.values()) {
        expect(key).toBe(values[i]);
        i++;
      }
    });
  });
});
