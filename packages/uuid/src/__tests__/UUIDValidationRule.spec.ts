import { ValidationError } from '@jamashita/publikum-validation';
import 'reflect-metadata';
import { UUIDValidationRule } from '../UUIDValidationRule';

describe('UUIDValidationRule', () => {
  describe('evaluate', () => {
    it('does not throw any Error', () => {
      expect.assertions(2);

      const rule: UUIDValidationRule = new UUIDValidationRule();

      expect(() => {
        rule.evaluate({}, 'f3b7dca2-e07f-47bb-bfac-53efc8abc4e8');
      }).not.toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'f4323f7b-bdf6-40f2-aa7c-91ff339f5704');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-string values given', () => {
      expect.assertions(13);

      const rule: UUIDValidationRule = new UUIDValidationRule();

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
        rule.evaluate({}, 20n);
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, {});
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, []);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when non-uuid string given', () => {
      expect.assertions(5);

      const rule: UUIDValidationRule = new UUIDValidationRule();

      expect(() => {
        rule.evaluate({}, '7d03c8c9-8ca1-4616-9285-5125c814a82');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'a4779dd7-1b6f-4281-a2f0-811e7f924');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '3d75cc15-aadb-44ba-894e-b0');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, '221343c9-6124-4e43-a16cb6dd311806a0');
      }).toThrow(ValidationError);
      expect(() => {
        rule.evaluate({}, 'b916817b-7ea4-476b8c54-13e572af3d61');
      }).toThrow(ValidationError);
    });
  });
});
