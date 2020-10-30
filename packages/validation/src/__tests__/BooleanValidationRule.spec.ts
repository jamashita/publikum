import { BooleanValidationRule } from '../BooleanValidationRule';
import { ValidationError } from '../Error/ValidationError';

describe('BooleanValidationRule', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(BooleanValidationRule.of()).toBe(BooleanValidationRule.of());
    });
  });

  describe('evaluate', () => {
    it('does not throw any Error', () => {
      expect.assertions(2);

      const rule: BooleanValidationRule = BooleanValidationRule.of();

      expect(() => {
        rule.evaluate({}, false);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, true);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-boolean values given', () => {
      expect.assertions(11);

      const rule: BooleanValidationRule = BooleanValidationRule.of();

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
        rule.evaluate({}, Symbol('p'));
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 20n);
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
