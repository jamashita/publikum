// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { ValidationError } from '../../Error/ValidationError';
import { StringValidation } from '../StringValidation';
import { Validate } from '../Validate';

class MockValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@StringValidation() _s: unknown): void {
    // NOOP
  }
}

class MockMinValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@StringValidation({ min: 4 }) _s: unknown): void {
    // NOOP
  }
}

class MockMaxValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@StringValidation({ max: 4 }) _s: unknown): void {
    // NOOP
  }
}

class MockPatternValidation {
  @Validate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public act(@StringValidation({ pattern: /^a.*b$/iu }) _s: unknown): void {
    // NOOP
  }
}

describe('StringValidation', () => {
  describe('decorator', () => {
    it('does not throw any Error', () => {
      expect.assertions(1);

      const validation: MockValidation = new MockValidation();

      expect(() => {
        validation.act('');
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

    it('throws ValidationError when less than min string length given', () => {
      expect.assertions(5);

      const validation: MockMinValidation = new MockMinValidation();

      expect(() => {
        validation.act('');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('p');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('pq');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('pqw');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('pqwo');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when greater than max string length given', () => {
      expect.assertions(5);

      const validation: MockMaxValidation = new MockMaxValidation();

      expect(() => {
        validation.act('pqwo1029');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('pqwo102');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('pqwo10');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('pqwo1');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('pqwo');
      }).not.toThrow(ValidationError);
    });

    it('throws ValidationError when string pattern does not match', () => {
      expect.assertions(8);

      const validation: MockPatternValidation = new MockPatternValidation();

      expect(() => {
        validation.act('a');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('b');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('ab');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act('ba');
      }).toThrow(ValidationError);
      expect(() => {
        validation.act('aab');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act('abb');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act('acb');
      }).not.toThrow(ValidationError);
      expect(() => {
        validation.act('abcab');
      }).not.toThrow(ValidationError);
    });
  });
});
