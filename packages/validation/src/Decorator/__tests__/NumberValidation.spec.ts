// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { ValidationError } from '../../Error/ValidationError';
import { NumberValidation } from '../NumberValidation';
import { Validate } from '../Validate';

class MockValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act1(@NumberValidation() _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act2(@NumberValidation({ min: 4 }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act3(@NumberValidation({ max: 4 }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act4(@NumberValidation({ int: true }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act5(@NumberValidation({ noNaN: true }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act6(@NumberValidation({ noInfinity: true }) _s: unknown): void {
    // NOOP
  }
}

describe('StringValidation', () => {
  describe('decorator', () => {
    it('does not throw any Error', () => {
      expect.assertions(6);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act1(-1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act1(0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act1(1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act1(-Infinity);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act1(NaN);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act1(Infinity);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when non-number values given', () => {
      expect.assertions(11);

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

    it('throws ValidationError when given value is less than min', () => {
      expect.assertions(9);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act2(-Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(-1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(-0.1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(0);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(2);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(3);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(3.5);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2(4);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is greater than max', () => {
      expect.assertions(8);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act3(Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(8);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(7.1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(7);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(6);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(5);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(4.4);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(4);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when decimal number given if int is set to true', () => {
      expect.assertions(4);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act4(1.1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act4(-1.3);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(-2);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when NaN given if noNaN is set to true', () => {
      expect.assertions(4);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act5(1.1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act5(4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act5(-2);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act5(NaN);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when Infinity of -Infinity given if noInfinity is set to true', () => {
      expect.assertions(5);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act6(1.1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act6(4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act6(-2);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act6(Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act6(-Infinity);
      }).toThrow(ValidationError);
    });
  });
});
