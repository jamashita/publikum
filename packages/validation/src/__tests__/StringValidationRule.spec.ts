import { ValidationError } from '../Error/ValidationError';
import { StringValidationRule } from '../StringValidationRule';

describe('StringValidationRule', () => {
  describe('evaluate', () => {
    it('does not throw any Error', () => {
      expect.assertions(1);

      const rule: StringValidationRule = StringValidationRule.of();

      expect(() => {
        rule.evaluate({}, '');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-string values given', () => {
      expect.assertions(10);

      const rule: StringValidationRule = StringValidationRule.of();

      expect(() => {
        rule.evaluate({}, null);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, undefined);
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
        rule.evaluate({}, 20n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, {});
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, []);
      }).toThrow(ValidationError);
    });

    it('does not throw any Error when given string can be converted to number', () => {
      expect.assertions(4);

      const rule: StringValidationRule = StringValidationRule.of({
        type: 'numerical'
      });

      expect(() => {
        rule.evaluate({}, '123');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '-123');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '0');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '0.18');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given string cannot be converted to number', () => {
      expect.assertions(6);

      const rule: StringValidationRule = StringValidationRule.of({
        type: 'numerical'
      });

      expect(() => {
        rule.evaluate({}, '1.2.3');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '0..');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '0..18');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'a');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '-Infinity');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'NaN');
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when string pattern does not match', () => {
      expect.assertions(8);

      const rule: StringValidationRule = StringValidationRule.of({
        type: 'pattern',
        pattern: /^a.*b$/iu
      });

      expect(() => {
        rule.evaluate({}, 'a');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'b');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'ab');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'ba');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'aab');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'abb');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'acb');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'abcab');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is less than min string length given', () => {
      expect.assertions(5);

      const rule: StringValidationRule = StringValidationRule.of({
        type: 'length',
        min: 4
      });

      expect(() => {
        rule.evaluate({}, '');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'p');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pq');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqw');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqwo');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is greater than max string length given', () => {
      expect.assertions(5);

      const rule: StringValidationRule = StringValidationRule.of({
        type: 'length',
        max: 4
      });

      expect(() => {
        rule.evaluate({}, 'pqwo1029');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqwo102');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqwo10');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqwo1');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqwo');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is less than min and greater than max string length given', () => {
      expect.assertions(7);

      const rule: StringValidationRule = StringValidationRule.of({
        type: 'length',
        min: 4,
        max: 6
      });

      expect(() => {
        rule.evaluate({}, 'pq');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqw');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqwo');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqwo1');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqwo10');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqwo102');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pqwo1029');
      }).toThrow(ValidationError);
    });

    it('does not throw any Error when given string is contained by array', () => {
      expect.assertions(4);

      const rule: StringValidationRule = StringValidationRule.of({
        type: 'contain',
        samples: [
          'po',
          'pu',
          'pe',
          'pi'
        ]
      });

      expect(() => {
        rule.evaluate({}, 'pi');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pu');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'po');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'pe');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given string is not contained by array', () => {
      expect.assertions(1);

      const rule: StringValidationRule = StringValidationRule.of({
        type: 'contain',
        samples: [
          'po',
          'pu',
          'pe',
          'pi'
        ]
      });

      expect(() => {
        rule.evaluate({}, 'p1');
      }).toThrow(ValidationError);
    });
  });
});
