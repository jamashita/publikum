import { Validate, ValidationError } from '@jamashita/publikum-validation';
import 'reflect-metadata';
import { UUIDValidation } from '../UUIDValidation';

class MockValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@UUIDValidation() _s: unknown): void {
    // NOOP
  }
}

describe('UUIDValidation', () => {
  describe('decorator', () => {
    it('does not throw any Error', () => {
      expect.assertions(2);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act('f3b7dca2-e07f-47bb-bfac-53efc8abc4e8');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act('f4323f7b-bdf6-40f2-aa7c-91ff339f5704');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-string values given', () => {
      expect.assertions(10);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act(null);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(undefined);
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
        validation.act(20n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act({});
      }).toThrow(ValidationError);
      expect(() => {
        validation.act([]);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when non-uuid string given', () => {
      expect.assertions(5);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act('7d03c8c9-8ca1-4616-9285-5125c814a82');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('a4779dd7-1b6f-4281-a2f0-811e7f924');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('3d75cc15-aadb-44ba-894e-b0');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('221343c9-6124-4e43-a16cb6dd311806a0');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('b916817b-7ea4-476b8c54-13e572af3d61');
      }).toThrow(ValidationError);
    });
  });
});
