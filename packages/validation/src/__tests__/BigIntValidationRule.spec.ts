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

    it('throws ValidationError when given value is less than min', () => {
      expect.assertions(6);

      const rule: BigIntValidationRule = new BigIntValidationRule({
        min: {
          condition: 't',
          value: 4
        }
      });

      expect(() => {
        rule.evaluate({}, -1n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 0n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 1n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 2n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 3n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4n);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is less than or equals to min', () => {
      expect.assertions(6);

      const rule: BigIntValidationRule = new BigIntValidationRule({
        min: {
          condition: 'te',
          value: 4
        }
      });

      expect(() => {
        rule.evaluate({}, -1n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 0n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 1n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 2n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 3n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4n);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when given value is greater than max', () => {
      expect.assertions(5);

      const rule: BigIntValidationRule = new BigIntValidationRule({
        max: {
          condition: 't',
          value: 4
        }
      });

      expect(() => {
        rule.evaluate({}, 8n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 7n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 6n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 5n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4n);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is greater than or equals to min', () => {
      expect.assertions(5);

      const rule: BigIntValidationRule = new BigIntValidationRule({
        max: {
          condition: 'te',
          value: 4
        }
      });

      expect(() => {
        rule.evaluate({}, 8n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 7n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 6n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 5n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4n);
      }).toThrow(ValidationError);
    });
  });
});
