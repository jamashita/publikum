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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act2(@StringValidation({ min: 4 }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act3(@StringValidation({ max: 4 }) _s: unknown): void {
    // NOOP
  }

  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act4(@StringValidation({ pattern: /^a.*b$/iu }) _s: unknown): void {
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

    it('throws ValidationError when less than min string length given', () => {
      expect.assertions(5);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act2('');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('p');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('pq');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('pqw');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act2('pqwo');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when greater than max string length given', () => {
      expect.assertions(5);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act3('pqwo1029');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3('pqwo102');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3('pqwo10');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3('pqwo1');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act3('pqwo');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when string pattern does not match', () => {
      expect.assertions(8);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act4('a');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4('b');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4('ab');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act4('ba');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act4('aab');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act4('abb');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act4('acb');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act4('abcab');
      }).not.toThrow(ValidationError);
    });
  });
});
