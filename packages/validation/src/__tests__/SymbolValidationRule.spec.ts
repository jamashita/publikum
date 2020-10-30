import { ValidationError } from '../Error/ValidationError';
import { SymbolValidationRule } from '../SymbolValidationRule';

describe('SymbolValidationRule', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(SymbolValidationRule.of()).toBe(SymbolValidationRule.of());
    });
  });

  describe('evaluate', () => {
    it('does not throw any Error', () => {
      expect.assertions(3);

      const rule: SymbolValidationRule = SymbolValidationRule.of();

      expect(() => {
        rule.evaluate({}, Symbol());
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, Symbol('mi'));
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, Symbol(-6));
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-symbol values given', () => {
      expect.assertions(12);

      const rule: SymbolValidationRule = SymbolValidationRule.of();

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
