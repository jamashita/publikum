// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { ValidationError } from '../../Error/ValidationError';
import { NumberValidation } from '../NumberValidation';
import { Validate } from '../Validate';

class MockValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@NumberValidation() _s: unknown): void {
    // NOOP
  }
}

class MockMinValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@NumberValidation({ min: 4 }) _s: unknown): void {
    // NOOP
  }
}

class MockMaxValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@NumberValidation({ max: 4 }) _s: unknown): void {
    // NOOP
  }
}

class MockIntValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@NumberValidation({ int: true }) _s: unknown): void {
    // NOOP
  }
}

class MockNonNaNValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@NumberValidation({ noNaN: true }) _s: unknown): void {
    // NOOP
  }
}

class MockNoInfinityValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@NumberValidation({ noInfinity: true }) _s: unknown): void {
    // NOOP
  }
}

describe('StringValidation', () => {
  describe('decorator', () => {
    it('does not throw any Error', () => {
      expect.assertions(6);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act(-1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(-Infinity);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(NaN);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(Infinity);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-number values given', () => {
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

    it('throws ValidationError when given value is less than min', () => {
      expect.assertions(9);

      const validation: MockMinValidation = new MockMinValidation();

      expect(() => {
        validation.act(-Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(-1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(-0.1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(0);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(2);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(3);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(3.5);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(4);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is greater than max', () => {
      expect.assertions(8);

      const validation: MockMaxValidation = new MockMaxValidation();

      expect(() => {
        validation.act(Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(8);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(7.1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(7);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(6);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(5);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(4.4);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(4);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when decimal number given if int is set to true', () => {
      expect.assertions(4);

      const validation: MockIntValidation = new MockIntValidation();

      expect(() => {
        validation.act(1.1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(-1.3);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(-2);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when NaN given if noNaN is set to true', () => {
      expect.assertions(4);

      const validation: MockNonNaNValidation = new MockNonNaNValidation();

      expect(() => {
        validation.act(1.1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(-2);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(NaN);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when Infinity of -Infinity given if noInfinity is set to true', () => {
      expect.assertions(5);

      const validation: MockNoInfinityValidation = new MockNoInfinityValidation();

      expect(() => {
        validation.act(1.1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(-2);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act(Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act(-Infinity);
      }).toThrow(ValidationError);
    });
  });
});
