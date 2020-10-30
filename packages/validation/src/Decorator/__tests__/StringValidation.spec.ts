// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { ValidationError } from '../../Error/ValidationError';
import { StringValidation } from '../StringValidation';
import { Validate } from '../Validate';

class MockValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act1(@StringValidation() _s: unknown): void {
    // NOOP
  }

  @Validate()
  public act2(@StringValidation({
    type: 'numerical'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  public act3(@StringValidation({
    type: 'pattern',
    pattern: /^a.*b$/iu
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  public act4(@StringValidation({
    type: 'length',
    min: 4
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  public act5(@StringValidation({
    type: 'length',
    max: 4
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  public act6(@StringValidation({
    type: 'length',
    min: 4,
    max: 6
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }) _s: unknown): void {
    // NOOP
  }
}

describe('StringValidation', () => {
  describe('decorator', () => {
    it('does not throw any Error', () => {
      expect.assertions(1);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act1('');
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

    it('does not throw any Error when given string can be converted to number', () => {
      expect.assertions(4);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act2('123');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act2('-123');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act2('0');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act2('0.18');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given string cannot be converted to number', () => {
      expect.assertions(7);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act2('1.2.3');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('0..');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('0..10');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('a');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('a');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('-Infinity');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('NaN');
      }).toThrow(ValidationError);
    });

    it('throws ValidationError when string pattern does not match', () => {
      expect.assertions(8);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act3('a');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3('b');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3('ab');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act3('ba');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3('aab');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act3('abb');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act3('acb');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act3('abcab');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when less than min string length given', () => {
      expect.assertions(5);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act4('');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4('p');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4('pq');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4('pqw');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4('pqwo');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when greater than max string length given', () => {
      expect.assertions(5);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act5('pqwo1029');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5('pqwo102');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5('pqwo10');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5('pqwo1');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act5('pqwo');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when given value is less than min and greater than max string length given', () => {
      expect.assertions(7);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act6('pq');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act6('pqw');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act6('pqwo');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act6('pqwo1');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act6('pqwo10');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act6('pqwo102');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act6('pqwo1029');
      }).toThrow(ValidationError);
    });
  });
});
