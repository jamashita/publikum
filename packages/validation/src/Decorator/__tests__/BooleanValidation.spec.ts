// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { ValidationError } from '../../Error/ValidationError';
import { BooleanValidation } from '../BooleanValidation';
import { Validate } from '../Validate';

class MockValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@BooleanValidation() _s: unknown): void {
    // NOOP
  }
}

describe('BooleanValidation', () => {
  describe('decorator', () => {
    it('does not throw any Error', () => {
      expect.assertions(2);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act(false);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(true);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-boolean values given', () => {
      expect.assertions(11);

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
        validation.act(Symbol('p'));
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(20n);
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
