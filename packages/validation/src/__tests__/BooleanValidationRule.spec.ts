import { BooleanValidationRule } from '../BooleanValidationRule';
import { ValidationError } from '../Error/ValidationError';

describe('BooleanValidationRule', () => {
  describe('evaluate', () => {
    it('does not throw any Error', () => {
      expect.assertions(2);

      const rule: BooleanValidationRule = new BooleanValidationRule();

      expect(() => {
        rule.evaluate({}, false);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, true);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-boolean values given', () => {
      expect.assertions(11);

      const rule: BooleanValidationRule = new BooleanValidationRule();

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
