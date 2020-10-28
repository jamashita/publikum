import { Validate, ValidationError } from '@jamashita/publikum-validation';
import 'reflect-metadata';
import { ZeitValidation } from '../ZeitValidation';

class MockValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act1(@ZeitValidation({ format: 'YYYY-MM-DD' }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act2(@ZeitValidation({ format: 'YYYY-MM-DD HH:mm:ss' }) _s: unknown, @ZeitValidation({ format: 'YYYY-MM-DD' }) _ss: unknown): void {
    // NOOP
  }
}

describe('ZeitValidation', () => {
  describe('decorator', () => {
    it('does not throw any Error', () => {
      expect.assertions(4);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act1('2000-01-01');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act1('2000-01-02');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act2('2000-01-01 01:02:03', '2000-01-02');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act2('2000-01-01 01:02:59', '2000-01-02');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-string values given', () => {
      expect.assertions(10);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act1(null);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1(undefined);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1(123);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1(0);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1(false);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1(true);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1(Symbol('p'));
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1(20n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1({});
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1([]);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when non-datetime string given', () => {
      expect.assertions(6);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act1('2000-01-0x');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1('2000-01-y1');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1('2000-01$01');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('2000-01-01 01:02:0x', '2000-01-02');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('2000-01-01 01:02:y3', '2000-01-02');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('2000-01-01 01:02$03', '2000-01-02');
      }).toThrow(ValidationError);
    });
  });
});
