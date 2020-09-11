import { MockRuntimeError } from '@jamashita/publikum-error';
import { randomBytes } from 'crypto';
import { Kind } from '../Kind';
import { Inconnu } from '../Value';

const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const random = (length: number): string => {
  const charLength: number = chars.length;

  return randomBytes(length).reduce<string>((p: string, i: number) => {
    return p + chars[i % charLength];
  }, '');
};

describe('Kind', () => {
  describe('isUndefined', () => {
    it('returns true only the value is undefined', () => {
      expect.assertions(13);
      expect(Kind.isUndefined(null)).toBe(false);
      expect(Kind.isUndefined(undefined)).toBe(true);
      expect(Kind.isUndefined('')).toBe(false);
      expect(Kind.isUndefined('123')).toBe(false);
      expect(Kind.isUndefined('abcd')).toBe(false);
      expect(Kind.isUndefined(123)).toBe(false);
      expect(Kind.isUndefined(0)).toBe(false);
      expect(Kind.isUndefined(false)).toBe(false);
      expect(Kind.isUndefined(true)).toBe(false);
      expect(Kind.isUndefined(Symbol('p'))).toBe(false);
      expect(Kind.isUndefined(20n)).toBe(false);
      expect(Kind.isUndefined({})).toBe(false);
      expect(Kind.isUndefined([])).toBe(false);
    });
  });

  describe('isNull', () => {
    it('returns true only the value is null', () => {
      expect.assertions(13);
      expect(Kind.isNull(null)).toBe(true);
      expect(Kind.isNull(undefined)).toBe(false);
      expect(Kind.isNull('')).toBe(false);
      expect(Kind.isNull('123')).toBe(false);
      expect(Kind.isNull('abcd')).toBe(false);
      expect(Kind.isNull(123)).toBe(false);
      expect(Kind.isNull(0)).toBe(false);
      expect(Kind.isNull(false)).toBe(false);
      expect(Kind.isNull(true)).toBe(false);
      expect(Kind.isNull(Symbol('p'))).toBe(false);
      expect(Kind.isNull(20n)).toBe(false);
      expect(Kind.isNull({})).toBe(false);
      expect(Kind.isNull([])).toBe(false);
    });
  });

  describe('isString', () => {
    it('even if numerical strings given, return true', () => {
      expect.assertions(13);
      expect(Kind.isString(null)).toBe(false);
      expect(Kind.isString(undefined)).toBe(false);
      expect(Kind.isString('')).toBe(true);
      expect(Kind.isString('123')).toBe(true);
      expect(Kind.isString('abcd')).toBe(true);
      expect(Kind.isString(123)).toBe(false);
      expect(Kind.isString(0)).toBe(false);
      expect(Kind.isString(false)).toBe(false);
      expect(Kind.isString(true)).toBe(false);
      expect(Kind.isString(Symbol('p'))).toBe(false);
      expect(Kind.isString(20n)).toBe(false);
      expect(Kind.isString({})).toBe(false);
      expect(Kind.isString([])).toBe(false);
    });
  });

  describe('isNumericalString', () => {
    it('returns true if the string is able to convert number', () => {
      expect.assertions(52);
      expect(Kind.isNumericalString(null)).toBe(false);
      expect(Kind.isNumericalString(undefined)).toBe(false);
      expect(Kind.isNumericalString(123)).toBe(false);
      expect(Kind.isNumericalString(0)).toBe(false);
      expect(Kind.isNumericalString(-12)).toBe(false);
      expect(Kind.isNumericalString(0.3)).toBe(false);
      expect(Kind.isNumericalString(NaN)).toBe(false);
      expect(Kind.isNumericalString(false)).toBe(false);
      expect(Kind.isNumericalString(true)).toBe(false);
      expect(Kind.isNumericalString(Symbol('p'))).toBe(false);
      expect(Kind.isNumericalString({})).toBe(false);
      expect(Kind.isNumericalString([])).toBe(false);
      expect(Kind.isNumericalString('a')).toBe(false);
      expect(Kind.isNumericalString('abcd')).toBe(false);
      expect(Kind.isNumericalString('')).toBe(false);
      expect(Kind.isNumericalString('+')).toBe(false);
      expect(Kind.isNumericalString('-')).toBe(false);
      expect(Kind.isNumericalString('.')).toBe(false);
      expect(Kind.isNumericalString('+.')).toBe(false);
      expect(Kind.isNumericalString('-.')).toBe(false);
      expect(Kind.isNumericalString('0')).toBe(true);
      expect(Kind.isNumericalString('0.')).toBe(false);
      expect(Kind.isNumericalString('+0.')).toBe(false);
      expect(Kind.isNumericalString('-0.')).toBe(false);
      expect(Kind.isNumericalString('.0')).toBe(false);
      expect(Kind.isNumericalString('+.0')).toBe(false);
      expect(Kind.isNumericalString('-.0')).toBe(false);
      expect(Kind.isNumericalString('.0.')).toBe(false);
      expect(Kind.isNumericalString('+.0.')).toBe(false);
      expect(Kind.isNumericalString('-.0.')).toBe(false);
      expect(Kind.isNumericalString('1.0')).toBe(true);
      expect(Kind.isNumericalString('+1.0')).toBe(true);
      expect(Kind.isNumericalString('-1.0')).toBe(true);
      expect(Kind.isNumericalString('1..0')).toBe(false);
      expect(Kind.isNumericalString('+1..0')).toBe(false);
      expect(Kind.isNumericalString('-1..0')).toBe(false);
      expect(Kind.isNumericalString('1.0.')).toBe(false);
      expect(Kind.isNumericalString('+1.0.')).toBe(false);
      expect(Kind.isNumericalString('-1.0.')).toBe(false);
      expect(Kind.isNumericalString('001')).toBe(true);
      expect(Kind.isNumericalString('001.')).toBe(false);
      expect(Kind.isNumericalString('+001.')).toBe(false);
      expect(Kind.isNumericalString('-001.')).toBe(false);
      expect(Kind.isNumericalString('001.0')).toBe(true);
      expect(Kind.isNumericalString('+001.0')).toBe(true);
      expect(Kind.isNumericalString('-001.0')).toBe(true);
      expect(Kind.isNumericalString('001..0')).toBe(false);
      expect(Kind.isNumericalString('+001..0')).toBe(false);
      expect(Kind.isNumericalString('-001..0')).toBe(false);
      expect(Kind.isNumericalString('001.0.')).toBe(false);
      expect(Kind.isNumericalString('+001.0.')).toBe(false);
      expect(Kind.isNumericalString('-001.0.')).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('returns true even if double values are provided', () => {
      expect.assertions(15);
      expect(Kind.isNumber(null)).toBe(false);
      expect(Kind.isNumber(undefined)).toBe(false);
      expect(Kind.isNumber('')).toBe(false);
      expect(Kind.isNumber('123')).toBe(false);
      expect(Kind.isNumber('abcd')).toBe(false);
      expect(Kind.isNumber(123)).toBe(true);
      expect(Kind.isNumber(0)).toBe(true);
      expect(Kind.isNumber(-12)).toBe(true);
      expect(Kind.isNumber(0.3)).toBe(true);
      expect(Kind.isNumber(NaN)).toBe(true);
      expect(Kind.isNumber(false)).toBe(false);
      expect(Kind.isNumber(true)).toBe(false);
      expect(Kind.isNumber(Symbol('p'))).toBe(false);
      expect(Kind.isNumber({})).toBe(false);
      expect(Kind.isNumber([])).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('returns false when the double values are given', () => {
      expect.assertions(16);
      expect(Kind.isInteger(null)).toBe(false);
      expect(Kind.isInteger(undefined)).toBe(false);
      expect(Kind.isInteger('')).toBe(false);
      expect(Kind.isInteger('123')).toBe(false);
      expect(Kind.isInteger('abcd')).toBe(false);
      expect(Kind.isInteger(123)).toBe(true);
      expect(Kind.isInteger(0)).toBe(true);
      expect(Kind.isInteger(-12)).toBe(true);
      expect(Kind.isInteger(0.3)).toBe(false);
      expect(Kind.isInteger(NaN)).toBe(false);
      expect(Kind.isInteger(false)).toBe(false);
      expect(Kind.isInteger(true)).toBe(false);
      expect(Kind.isInteger(Symbol('p'))).toBe(false);
      expect(Kind.isInteger(20n)).toBe(false);
      expect(Kind.isInteger({})).toBe(false);
      expect(Kind.isInteger([])).toBe(false);
    });
  });

  describe('isNaN', () => {
    it('returns true when only the value is NaN', () => {
      expect.assertions(16);
      expect(Kind.isNaN(null)).toBe(false);
      expect(Kind.isNaN(undefined)).toBe(false);
      expect(Kind.isNaN('')).toBe(false);
      expect(Kind.isNaN('123')).toBe(false);
      expect(Kind.isNaN('abcd')).toBe(false);
      expect(Kind.isNaN(123)).toBe(false);
      expect(Kind.isNaN(0)).toBe(false);
      expect(Kind.isNaN(-12)).toBe(false);
      expect(Kind.isNaN(0.3)).toBe(false);
      expect(Kind.isNaN(NaN)).toBe(true);
      expect(Kind.isNaN(false)).toBe(false);
      expect(Kind.isNaN(true)).toBe(false);
      expect(Kind.isNaN(Symbol('p'))).toBe(false);
      expect(Kind.isNaN(20n)).toBe(false);
      expect(Kind.isNaN({})).toBe(false);
      expect(Kind.isNaN([])).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('returns true when true and false are given', () => {
      expect.assertions(15);
      expect(Kind.isBoolean(null)).toBe(false);
      expect(Kind.isBoolean(undefined)).toBe(false);
      expect(Kind.isBoolean('')).toBe(false);
      expect(Kind.isBoolean('123')).toBe(false);
      expect(Kind.isBoolean('abcd')).toBe(false);
      expect(Kind.isBoolean(123)).toBe(false);
      expect(Kind.isBoolean(0)).toBe(false);
      expect(Kind.isBoolean(-12)).toBe(false);
      expect(Kind.isBoolean(0.3)).toBe(false);
      expect(Kind.isBoolean(false)).toBe(true);
      expect(Kind.isBoolean(true)).toBe(true);
      expect(Kind.isBoolean(Symbol('p'))).toBe(false);
      expect(Kind.isBoolean(20n)).toBe(false);
      expect(Kind.isBoolean({})).toBe(false);
      expect(Kind.isBoolean([])).toBe(false);
    });
  });

  describe('isSymbol', () => {
    it('returns true only the value is undefined', () => {
      expect.assertions(13);
      expect(Kind.isSymbol(null)).toBe(false);
      expect(Kind.isSymbol(undefined)).toBe(false);
      expect(Kind.isSymbol('')).toBe(false);
      expect(Kind.isSymbol('123')).toBe(false);
      expect(Kind.isSymbol('abcd')).toBe(false);
      expect(Kind.isSymbol(123)).toBe(false);
      expect(Kind.isSymbol(0)).toBe(false);
      expect(Kind.isSymbol(false)).toBe(false);
      expect(Kind.isSymbol(true)).toBe(false);
      expect(Kind.isSymbol(Symbol('p'))).toBe(true);
      expect(Kind.isSymbol(20n)).toBe(false);
      expect(Kind.isSymbol({})).toBe(false);
      expect(Kind.isSymbol([])).toBe(false);
    });
  });

  describe('isBigInt', () => {
    it('returns true only the value is undefined', () => {
      expect.assertions(13);
      expect(Kind.isBigInt(null)).toBe(false);
      expect(Kind.isBigInt(undefined)).toBe(false);
      expect(Kind.isBigInt('')).toBe(false);
      expect(Kind.isBigInt('123')).toBe(false);
      expect(Kind.isBigInt('abcd')).toBe(false);
      expect(Kind.isBigInt(123)).toBe(false);
      expect(Kind.isBigInt(0)).toBe(false);
      expect(Kind.isBigInt(false)).toBe(false);
      expect(Kind.isBigInt(true)).toBe(false);
      expect(Kind.isBigInt(Symbol('p'))).toBe(false);
      expect(Kind.isBigInt(20n)).toBe(true);
      expect(Kind.isBigInt({})).toBe(false);
      expect(Kind.isBigInt([])).toBe(false);
    });
  });

  describe('isPrimitive', () => {
    it('returns true if the value is null, undefined, boolean, number, string', () => {
      expect.assertions(20);
      expect(Kind.isPrimitive(null)).toBe(true);
      expect(Kind.isPrimitive(undefined)).toBe(true);
      expect(Kind.isPrimitive(false)).toBe(true);
      expect(Kind.isPrimitive(true)).toBe(true);
      expect(Kind.isPrimitive(-1)).toBe(true);
      expect(Kind.isPrimitive(0)).toBe(true);
      expect(Kind.isPrimitive(1)).toBe(true);
      expect(Kind.isPrimitive('')).toBe(true);
      expect(Kind.isPrimitive('a')).toBe(true);
      expect(Kind.isPrimitive('0')).toBe(true);
      expect(Kind.isPrimitive('1')).toBe(true);
      expect(Kind.isPrimitive(Symbol('p'))).toBe(true);
      expect(Kind.isPrimitive(20n)).toBe(true);
      expect(Kind.isPrimitive([])).toBe(false);
      expect(Kind.isPrimitive([null])).toBe(false);
      expect(Kind.isPrimitive([undefined])).toBe(false);
      expect(Kind.isPrimitive({})).toBe(false);
      expect(Kind.isPrimitive({ key: null })).toBe(false);
      expect(Kind.isPrimitive({ key: undefined })).toBe(false);
      expect(Kind.isPrimitive(Object.create(null))).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('returns true only if the function given', () => {
      expect.assertions(17);
      expect(Kind.isFunction(null)).toBe(false);
      expect(Kind.isFunction(undefined)).toBe(false);
      expect(Kind.isFunction('')).toBe(false);
      expect(Kind.isFunction('123')).toBe(false);
      expect(Kind.isFunction('abcd')).toBe(false);
      expect(Kind.isFunction(123)).toBe(false);
      expect(Kind.isFunction(0)).toBe(false);
      expect(Kind.isFunction(-12)).toBe(false);
      expect(Kind.isFunction(0.3)).toBe(false);
      expect(Kind.isFunction(false)).toBe(false);
      expect(Kind.isFunction(true)).toBe(false);
      expect(Kind.isFunction(Symbol('p'))).toBe(false);
      expect(Kind.isFunction(20n)).toBe(false);
      expect(Kind.isFunction({})).toBe(false);
      expect(Kind.isFunction([])).toBe(false);
      expect(Kind.isFunction(Object.create(null))).toBe(false);
      expect(
        Kind.isFunction(() => {
          // NOOP
        })
      ).toBe(true);
    });
  });

  describe('isObject', () => {
    it('returns true only if the array given', () => {
      expect.assertions(17);
      expect(Kind.isObject(null)).toBe(false);
      expect(Kind.isObject(undefined)).toBe(false);
      expect(Kind.isObject('')).toBe(false);
      expect(Kind.isObject('123')).toBe(false);
      expect(Kind.isObject('abcd')).toBe(false);
      expect(Kind.isObject(123)).toBe(false);
      expect(Kind.isObject(0)).toBe(false);
      expect(Kind.isObject(-12)).toBe(false);
      expect(Kind.isObject(0.3)).toBe(false);
      expect(Kind.isObject(false)).toBe(false);
      expect(Kind.isObject(true)).toBe(false);
      expect(Kind.isObject(Symbol('p'))).toBe(false);
      expect(Kind.isObject(20n)).toBe(false);
      expect(Kind.isObject({})).toBe(true);
      expect(Kind.isObject([])).toBe(true);
      expect(Kind.isObject(Object.create(null))).toBe(true);
      expect(
        Kind.isObject(() => {
          // NOOP
        })
      ).toBe(false);
    });
  });

  describe('isPromiseLike', () => {
    it('returns true only if the array given', () => {
      expect.assertions(28);
      expect(Kind.isPromiseLike(null)).toBe(false);
      expect(Kind.isPromiseLike(undefined)).toBe(false);
      expect(Kind.isPromiseLike('')).toBe(false);
      expect(Kind.isPromiseLike('123')).toBe(false);
      expect(Kind.isPromiseLike('abcd')).toBe(false);
      expect(Kind.isPromiseLike(123)).toBe(false);
      expect(Kind.isPromiseLike(0)).toBe(false);
      expect(Kind.isPromiseLike(-12)).toBe(false);
      expect(Kind.isPromiseLike(0.3)).toBe(false);
      expect(Kind.isPromiseLike(false)).toBe(false);
      expect(Kind.isPromiseLike(true)).toBe(false);
      expect(Kind.isPromiseLike(Symbol('p'))).toBe(false);
      expect(Kind.isPromiseLike(20n)).toBe(false);
      expect(Kind.isPromiseLike({})).toBe(false);
      expect(Kind.isPromiseLike([])).toBe(false);
      expect(Kind.isPromiseLike(Object.create(null))).toBe(false);
      expect(
        Kind.isPromiseLike(() => {
          // NOOP
        })
      ).toBe(false);
      expect(
        Kind.isPromiseLike(
          new Promise<unknown>(() => {
            // NOOP
          })
        )
      ).toBe(true);
      expect(
        Kind.isPromiseLike({
          then: undefined
        })
      ).toBe(false);
      expect(
        Kind.isPromiseLike({
          then: null
        })
      ).toBe(false);
      expect(
        Kind.isPromiseLike({
          then: ''
        })
      ).toBe(false);
      expect(
        Kind.isPromiseLike({
          then: 123
        })
      ).toBe(false);
      expect(
        Kind.isPromiseLike({
          then: false
        })
      ).toBe(false);
      expect(
        Kind.isPromiseLike({
          then: Symbol('p')
        })
      ).toBe(false);
      expect(
        Kind.isPromiseLike({
          then: 20n
        })
      ).toBe(false);
      expect(
        Kind.isPromiseLike({
          then: {}
        })
      ).toBe(false);
      expect(
        Kind.isPromiseLike({
          then: []
        })
      ).toBe(false);
      expect(
        Kind.isPromiseLike({
          then: () => {
            // NOOP
          }
        })
      ).toBe(true);
    });
  });

  describe('isArray', () => {
    it('returns true only if the array given', () => {
      expect.assertions(16);
      expect(Kind.isArray(null)).toBe(false);
      expect(Kind.isArray(undefined)).toBe(false);
      expect(Kind.isArray('')).toBe(false);
      expect(Kind.isArray('123')).toBe(false);
      expect(Kind.isArray('abcd')).toBe(false);
      expect(Kind.isArray(123)).toBe(false);
      expect(Kind.isArray(0)).toBe(false);
      expect(Kind.isArray(-12)).toBe(false);
      expect(Kind.isArray(0.3)).toBe(false);
      expect(Kind.isArray(false)).toBe(false);
      expect(Kind.isArray(true)).toBe(false);
      expect(Kind.isArray(Symbol('p'))).toBe(false);
      expect(Kind.isArray(20n)).toBe(false);
      expect(Kind.isArray({})).toBe(false);
      expect(Kind.isArray([])).toBe(true);
      expect(Kind.isArray(Object.create(null))).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('returns false if array given', () => {
      expect.assertions(21);
      expect(Kind.isPlainObject(null)).toBe(false);
      expect(Kind.isPlainObject(undefined)).toBe(false);
      expect(Kind.isPlainObject('')).toBe(false);
      expect(Kind.isPlainObject('123')).toBe(false);
      expect(Kind.isPlainObject('abcd')).toBe(false);
      expect(Kind.isPlainObject(123)).toBe(false);
      expect(Kind.isPlainObject(0)).toBe(false);
      expect(Kind.isPlainObject(-12)).toBe(false);
      expect(Kind.isPlainObject(0.3)).toBe(false);
      expect(Kind.isPlainObject(false)).toBe(false);
      expect(Kind.isPlainObject(true)).toBe(false);
      expect(Kind.isPlainObject(Symbol('p'))).toBe(false);
      expect(Kind.isPlainObject(20n)).toBe(false);
      expect(Kind.isPlainObject({})).toBe(true);
      expect(Kind.isPlainObject([])).toBe(false);
      expect(Kind.isPlainObject(new Error())).toBe(false);
      expect(Kind.isPlainObject({ e: new Error() })).toBe(false);
      expect(Kind.isPlainObject({ e: { e: new Error() } })).toBe(false);
      expect(Kind.isPlainObject({ s: 1 })).toBe(true);
      expect(Kind.isPlainObject({ s: { s: 1 } })).toBe(true);
      expect(Kind.isPlainObject(Object.create(null))).toBe(true);
    });
  });

  describe('isClass', () => {
    it('returns false if array given', () => {
      expect.assertions(6);
      expect(Kind.isClass({}, Object)).toBe(true);
      expect(Kind.isClass([], Array)).toBe(true);
      expect(Kind.isClass(Object.create(null), Object)).toBe(false);
      expect(Kind.isClass(new Error(), Error)).toBe(true);
      expect(Kind.isClass(new MockRuntimeError(), Error)).toBe(true);
      expect(Kind.isClass(new MockRuntimeError(), MockRuntimeError)).toBe(true);
    });
  });

  describe('notate', () => {
    it('undefined', () => {
      expect.assertions(1);
      expect(Kind.notate(undefined)).toBe('undefined');
    });

    it('null', () => {
      expect.assertions(1);
      expect(Kind.notate(null)).toBe('null');
    });

    it('boolean', () => {
      expect.assertions(2);
      expect(Kind.notate(false)).toBe('false');
      expect(Kind.notate(true)).toBe('true');
    });

    it('number', () => {
      expect.assertions(201);
      for (let i: number = -100; i <= 100; i++) {
        expect(Kind.notate(i)).toBe(`${i}`);
      }
    });

    it('string', () => {
      expect.assertions(100);
      for (let i: number = 0; i < 100; i++) {
        const str: string = random(40);

        expect(Kind.notate(str)).toBe(str);
      }
    });

    it('symbol', () => {
      expect.assertions(100);
      for (let i: number = 0; i < 100; i++) {
        const sym: symbol = Symbol(random(40));

        expect(Kind.notate(sym)).toBe(sym.toString());
      }
    });

    it('bigint', () => {
      expect.assertions(201);
      for (let i: bigint = -100n; i <= 100n; i++) {
        expect(Kind.notate(i)).toBe(`${i}`);
      }
    });

    it('object literal', () => {
      expect.assertions(2);
      expect(Kind.notate({})).toBe('[object Object]');

      const obj: Inconnu = {};

      for (let i: number = 0; i < 100; i++) {
        obj[random(40)] = random(40);
      }

      expect(Kind.notate(obj)).toBe('[object Object]');
    });

    it('object.create(null)', () => {
      expect.assertions(2);
      expect(Kind.notate(Object.create(null))).toBe('[object Object]');

      const obj: Inconnu = {};

      for (let i: number = 0; i < 100; i++) {
        obj[random(40)] = random(40);
      }

      expect(Kind.notate(obj)).toBe('[object Object]');
    });

    it('returns itself when it has toString()', () => {
      expect.assertions(100);
      for (let i: number = 0; i < 100; i++) {
        const str: string = random(40);

        expect(Kind.notate({
          toString(): string {
            return str;
          }
        })).toBe(str);
      }
    });
  });
});
