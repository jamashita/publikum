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
  public act2(@NumberValidation({
    min: {
      condition: 't',
      value: 4
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  public act3(@NumberValidation({
    min: {
      condition: 'te',
      value: 4
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act4(@NumberValidation({
    max: {
      condition: 't',
      value: 4
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act5(@NumberValidation({
    max: {
      condition: 'te',
      value: 4
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act6(@NumberValidation({ int: true }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act7(@NumberValidation({ noNaN: true }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act8(@NumberValidation({ noInfinity: true }) _s: unknown): void {
    // NOOP
  }
}

describe('StringValidation', () => {
  describe('decorator', () => {
    it('does not throw any Error', () => {
      expect.assertions(8);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act1(-1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act1(-1.01);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act1(0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act1(1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act1(1.09);
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

    it('throws ValidationError when given value is less than or equals min', () => {
      expect.assertions(9);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act3(-Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(-1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(-0.1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(0);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(2);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(3);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(3.5);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3(4);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when given value is greater than max', () => {
      expect.assertions(8);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act4(Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(8);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(7.1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(7);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(6);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(5);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(4.4);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4(4);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is greater than or equals max', () => {
      expect.assertions(8);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act5(Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5(8);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5(7.1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5(7);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5(6);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5(5);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5(4.4);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5(4);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when decimal number given if int is set to true', () => {
      expect.assertions(4);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act6(1.1);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act6(4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act6(-1.3);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act6(-2);
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when NaN given if noNaN is set to true', () => {
      expect.assertions(4);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act7(1.1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act7(4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act7(-2);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act7(NaN);
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when Infinity of -Infinity given if noInfinity is set to true', () => {
      expect.assertions(5);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act8(1.1);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act8(4.0);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act8(-2);
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act8(Infinity);
      }).toThrow(ValidationError);
      expect(() => {
        validation.act8(-Infinity);
      }).toThrow(ValidationError);
    });
  });
});
