import { Kind } from '../Kind';

describe('Kind', () => {
  describe('isUndefined', () => {
    it('returns true only the value is undefined', () => {
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
      expect(Kind.isUndefined({})).toBe(false);
      expect(Kind.isUndefined([])).toBe(false);
    });
  });

  describe('isNull', () => {
    it('returns true only the value is null', () => {
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
      expect(Kind.isNull({})).toBe(false);
      expect(Kind.isNull([])).toBe(false);
    });
  });

  describe('isString', () => {
    it('even if numerical strings given, return true', () => {
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
      expect(Kind.isString({})).toBe(false);
      expect(Kind.isString([])).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('returns true even if double values are provided', () => {
      expect(Kind.isNumber(null)).toBe(false);
      expect(Kind.isNumber(undefined)).toBe(false);
      expect(Kind.isNumber('')).toBe(false);
      expect(Kind.isNumber('123')).toBe(false);
      expect(Kind.isNumber('abcd')).toBe(false);
      expect(Kind.isNumber(123)).toBe(true);
      expect(Kind.isNumber(0)).toBe(true);
      expect(Kind.isNumber(-12)).toBe(true);
      expect(Kind.isNumber(0.3)).toBe(true);
      expect(Kind.isNumber(false)).toBe(false);
      expect(Kind.isNumber(true)).toBe(false);
      expect(Kind.isNumber(Symbol('p'))).toBe(false);
      expect(Kind.isNumber({})).toBe(false);
      expect(Kind.isNumber([])).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('returns false when the double values are given', () => {
      expect(Kind.isInteger(null)).toBe(false);
      expect(Kind.isInteger(undefined)).toBe(false);
      expect(Kind.isInteger('')).toBe(false);
      expect(Kind.isInteger('123')).toBe(false);
      expect(Kind.isInteger('abcd')).toBe(false);
      expect(Kind.isInteger(123)).toBe(true);
      expect(Kind.isInteger(0)).toBe(true);
      expect(Kind.isInteger(-12)).toBe(true);
      expect(Kind.isInteger(0.3)).toBe(false);
      expect(Kind.isInteger(false)).toBe(false);
      expect(Kind.isInteger(true)).toBe(false);
      expect(Kind.isNumber(Symbol('p'))).toBe(false);
      expect(Kind.isInteger({})).toBe(false);
      expect(Kind.isInteger([])).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('returns true when true and false are given', () => {
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
      expect(Kind.isBoolean({})).toBe(false);
      expect(Kind.isBoolean([])).toBe(false);
    });
  });

  describe('isSymbol', () => {
    it('returns true only the value is undefined', () => {
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
      expect(Kind.isSymbol({})).toBe(false);
      expect(Kind.isSymbol([])).toBe(false);
    });
  });

  describe('isPrimitive', () => {
    it('returns true if the value is null, undefined, boolean, number, string', () => {
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
      expect(Kind.isPrimitive([])).toBe(false);
      expect(Kind.isPrimitive([null])).toBe(false);
      expect(Kind.isPrimitive([undefined])).toBe(false);
      expect(Kind.isPrimitive({})).toBe(false);
      expect(Kind.isPrimitive({ key: null })).toBe(false);
      expect(Kind.isPrimitive({ key: undefined })).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('returns false if array is given', () => {
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
      expect(Kind.isPlainObject({})).toBe(true);
      expect(Kind.isPlainObject([])).toBe(false);
      expect(Kind.isPlainObject(new Error())).toBe(false);
    });
  });

  describe('isArray', () => {
    it('returns true only if the array is given', () => {
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
      expect(Kind.isArray({})).toBe(false);
      expect(Kind.isArray([])).toBe(true);
    });
  });
});
