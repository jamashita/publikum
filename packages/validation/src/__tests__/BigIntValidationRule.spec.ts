import 'reflect-metadata';
import { BigIntValidationRule } from '../BigIntValidationRule';
import { ValidationError } from '../Error/ValidationError';

describe('BigIntValidationRule', () => {
  describe('evaluate', () => {
    it('does not throw any Error', () => {
      expect.assertions(3);

      const rule: BigIntValidationRule = new BigIntValidationRule();

      expect(() => {
        rule.evaluate({}, 20n);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 0n);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -19n);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-bigint values given', () => {
      expect.assertions(12);

      const rule: BigIntValidationRule = new BigIntValidationRule();

      expect(() => {
        rule.evaluate({}, null);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, undefined);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '123');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'abcd');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 123);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 0);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, false);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, true);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, Symbol('p'));
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, {});
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, []);
      }).toThrow(ValidationError);
    });
  });
});
