// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { ValidationError } from '../../Error/ValidationError';
import { BigIntValidation } from '../BigIntValidation';
import { Validate } from '../Validate';

class MockValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@BigIntValidation() _s: unknown): void {
    // NOOP
  }
}

describe('BigIntValidation', () => {
  describe('decorator', () => {
    it('does not throw any Error', () => {
      expect.assertions(1);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act(20n);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-bigint values given', () => {
      expect.assertions(12);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act(null);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(undefined);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('123');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('abcd');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(123);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(0);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(false);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(true);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(Symbol('p'));
      }).toThrow(ValidationError);
      expect(() => {
        validation.act({});
      }).toThrow(ValidationError);
      expect(() => {
        validation.act([]);
      }).toThrow(ValidationError);
    });
  });
});
