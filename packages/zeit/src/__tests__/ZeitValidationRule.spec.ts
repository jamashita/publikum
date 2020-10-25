import { ValidationError } from '@jamashita/publikum-validation';
import { ZeitValidationRule } from '../ZeitValidationRule';

describe('ZeitValidationRule', () => {
  describe('evaluate', () => {
    it('does not throw any Error', () => {
      expect.assertions(4);

      const rule1: ZeitValidationRule = new ZeitValidationRule({
        format: 'YYYY-MM-DD'
      });
      const rule2: ZeitValidationRule = new ZeitValidationRule({
        format: 'YYYY-MM-DD HH:mm:ss'
      });

      expect(() => {
        rule1.evaluate({}, '2000-01-01');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule1.evaluate({}, '2000-01-02');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule2.evaluate({}, '2000-01-01 01:02:03');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule2.evaluate({}, '2000-01-01 01:02:59');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-string values given', () => {
      expect.assertions(10);

      const rule: ZeitValidationRule = new ZeitValidationRule({
        format: 'YYYY-MM-DD'
      });

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

    it('throws ValidationError when non-datetime string given', () => {
      expect.assertions(3);

      const rule: ZeitValidationRule = new ZeitValidationRule({
        format: 'YYYY-MM-DD'
      });

      expect(() => {
        rule.evaluate({}, '2000-01-0x');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '2000-01-y1');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '2000-01$01');
      }).toThrow(ValidationError);
    });
  });
});
