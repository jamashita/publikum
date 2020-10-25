import 'reflect-metadata';
import { ValidationError } from '../Error/ValidationError';
import { StringValidationRule } from '../StringValidationRule';

describe('StringValidationRule', () => {
  describe('evaluate', () => {
    it('does not throw any Error', () => {
      expect.assertions(1);

      const rule: StringValidationRule = new StringValidationRule({});

      expect(() => {
        rule.evaluate({}, '');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-string values given', () => {
      expect.assertions(10);

      const rule: StringValidationRule = new StringValidationRule({});

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

    it('throws ValidationError when less than min string length given', () => {
      expect.assertions(5);

      const rule: StringValidationRule = new StringValidationRule({
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

    it('throws ValidationError when greater than max string length given', () => {
      expect.assertions(5);

      const rule: StringValidationRule = new StringValidationRule({
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

    it('throws ValidationError when string pattern does not match', () => {
      expect.assertions(8);

      const rule: StringValidationRule = new StringValidationRule({
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
  });
});
