import { ValidationError } from '../Error/ValidationError';
import { NumberValidationRule } from '../NumberValidationRule';

describe('NumberValidationRule', () => {
  describe('evaluate', () => {
    it('does not throw any Error', () => {
      expect.assertions(6);

      const rule: NumberValidationRule = new NumberValidationRule({});

      expect(() => {
        rule.evaluate({}, -1);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 0);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 1);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -Infinity);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, NaN);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, Infinity);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-number values given', () => {
      expect.assertions(11);

      const rule: NumberValidationRule = new NumberValidationRule({});

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

    it('throws ValidationError when given value is less than min', () => {
      expect.assertions(9);

      const rule: NumberValidationRule = new NumberValidationRule({
        min: {
          condition: 't',
          value: 4
        }
      });

      expect(() => {
        rule.evaluate({}, -Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -1);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -0.1);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 0);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 1);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 2);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 3);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 3.5);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4);
      }).not.toThrow(ValidationError);
    });
    it('throws ValidationError when given value is less than or equals min', () => {
      expect.assertions(9);

      const rule: NumberValidationRule = new NumberValidationRule({
        min: {
          condition: 'te',
          value: 4
        }
      });

      expect(() => {
        rule.evaluate({}, -Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -1);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -0.1);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 0);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 1);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 2);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 3);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 3.5);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when given value is greater than max', () => {
      expect.assertions(8);

      const rule: NumberValidationRule = new NumberValidationRule({
        max: {
          condition: 't',
          value: 4
        }
      });

      expect(() => {
        rule.evaluate({}, Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 8);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 7.1);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 7);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 6);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 5);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4.4);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is greater than or equals max', () => {
      expect.assertions(8);

      const rule: NumberValidationRule = new NumberValidationRule({
        max: {
          condition: 'te',
          value: 4
        }
      });

      expect(() => {
        rule.evaluate({}, Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 8);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 7.1);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 7);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 6);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 5);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4.4);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when decimal number given if int is set to true', () => {
      expect.assertions(4);

      const rule: NumberValidationRule = new NumberValidationRule({
        int: true
      });

      expect(() => {
        rule.evaluate({}, 1.1);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -1.3);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -2);
      }).not.toThrow(ValidationError);
    });

    it('does not throw any Error when int is set to false', () => {
      expect.assertions(4);

      const rule: NumberValidationRule = new NumberValidationRule({
        int: false
      });

      expect(() => {
        rule.evaluate({}, 1.1);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -1.3);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -2);
      }).not.toThrow(ValidationError);
    });

    it('will throw the same response if omitted in case of int is set to false', () => {
      expect.assertions(4);

      const rule: NumberValidationRule = new NumberValidationRule({});

      expect(() => {
        rule.evaluate({}, 1.1);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -1.3);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -2);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when NaN given if noNaN is set to true', () => {
      expect.assertions(4);

      const rule: NumberValidationRule = new NumberValidationRule({
        noNaN: true
      });

      expect(() => {
        rule.evaluate({}, 1.1);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -2);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, NaN);
      }).toThrow(ValidationError);
    });

    it('does not throw any Error when noNaN is set to false', () => {
      expect.assertions(1);

      const rule: NumberValidationRule = new NumberValidationRule({
        noNaN: false
      });

      expect(() => {
        rule.evaluate({}, NaN);
      }).not.toThrow(ValidationError);
    });

    it('will throw the same response if omitted in case of noNaN is set to false', () => {
      expect.assertions(1);

      const rule: NumberValidationRule = new NumberValidationRule({});

      expect(() => {
        rule.evaluate({}, NaN);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when Infinity of -Inifinity given if noInfinity is set to true', () => {
      expect.assertions(5);

      const rule: NumberValidationRule = new NumberValidationRule({
        noInfinity: true
      });

      expect(() => {
        rule.evaluate({}, 1.1);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -2);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -Infinity);
      }).toThrow(ValidationError);
    });

    it('does not throw any Error when noInfinity is set to false', () => {
      expect.assertions(2);

      const rule: NumberValidationRule = new NumberValidationRule({
        noInfinity: false
      });

      expect(() => {
        rule.evaluate({}, Infinity);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -Infinity);
      }).not.toThrow(ValidationError);
    });

    it('will throw the same response if omitted in case of noInfinity is set to false', () => {
      expect.assertions(2);

      const rule: NumberValidationRule = new NumberValidationRule({});

      expect(() => {
        rule.evaluate({}, Infinity);
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, -Infinity);
      }).not.toThrow(ValidationError);
    });
  });
});
