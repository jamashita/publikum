// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { ValidationError } from '../../Error/ValidationError';
import { BigIntValidation } from '../BigIntValidation';
import { Validate } from '../Validate';

class MockValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act1(@BigIntValidation() _s: unknown): void {
    // NOOP
  }

  @Validate()
  public act2(@BigIntValidation({
    min: {
      condition: 't',
      value: 4
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  public act3(@BigIntValidation({
    min: {
      condition: 'te',
      value: 4
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  public act4(@BigIntValidation({
    max: {
      condition: 't',
      value: 4
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  public act5(@BigIntValidation({
    max: {
      condition: 'te',
      value: 4
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }
}

describe('BigIntValidation', () => {
  describe('decorator', () => {
    it('does not throw any Error', () => {
      expect.assertions(1);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act1(20n);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-bigint values given', () => {
      expect.assertions(12);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act1(null);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1(undefined);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1('');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1('123');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1('abcd');
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
        validation.act1({});
      }).toThrow(ValidationError);
      expect(() => {
        validation.act1([]);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when given value is less than min', () => {
      expect.assertions(6);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act2(-1n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(0n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(1n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(2n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(3n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(4n);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is less than or equals to min', () => {
      expect.assertions(6);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act3(-1n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(0n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(1n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(2n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(3n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(4);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when given value is greater than min', () => {
      expect.assertions(5);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act4(8n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(7n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(6n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(5n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(4n);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is greater than or equals to min', () => {
      expect.assertions(5);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act5(8n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5(7n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5(6n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5(5n);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5(4n);
      }).toThrow(ValidationError);
    });
  });
});
