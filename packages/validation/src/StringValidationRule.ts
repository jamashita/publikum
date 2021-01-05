import { Kind } from '@jamashita/publikum-type';
import { ValidationError } from './Error/ValidationError';
import { ValidationRule } from './Interface/ValidationRule';

type NumericalStringPattern = Readonly<{
  type: 'numerical';
}>;

type RegExpPattern = Readonly<{
  type: 'pattern';
  pattern: RegExp;
}>;

type StringLengthPattern = Readonly<{
  type: 'length';
  min?: number;
  max?: number;
}>;

type ContainPattern = Readonly<{
  type: 'contain';
  samples: ReadonlyArray<string>;
}>;

type NoPattern = Readonly<{
  type: 'none';
}>;

export type StringValidationArgs = ContainPattern | NumericalStringPattern | RegExpPattern | StringLengthPattern;

const NONE: NoPattern = {
  type: 'none'
};

export class StringValidationRule implements ValidationRule {
  private readonly args: NoPattern | StringValidationArgs;

  public static of(args: NoPattern | StringValidationArgs = NONE): StringValidationRule {
    return new StringValidationRule(args);
  }

  protected constructor(args: NoPattern | StringValidationArgs) {
    this.args = args;
  }

  public evaluate(_target: object, value: unknown): void {
    if (!Kind.isString(value)) {
      throw new ValidationError('VALUE IS NOT STRING');
    }

    switch (this.args.type) {
      case 'numerical': {
        if (!Kind.isNumericalString(value)) {
          throw new ValidationError(`VALUE IS NOT NUMERICAL STRING. GIVEN: ${value as string}`);
        }

        return;
      }
      case 'pattern': {
        if (!this.args.pattern.test(value)) {
          throw new ValidationError(`VALUE DOES NOT FOLLOW THE PATTERN. GIVEN: ${value}`);
        }

        return;
      }
      case 'length': {
        if (!Kind.isUndefined(this.args.min)) {
          if (value.length < this.args.min) {
            throw new ValidationError(`VALUE IS SHORTER THAN min. GIVEN: ${value}`);
          }
        }
        if (!Kind.isUndefined(this.args.max)) {
          if (this.args.max < value.length) {
            throw new ValidationError(`VALUE IS LONGER THAN max. GIVEN: ${value}`);
          }
        }

        return;
      }
      case 'contain': {
        if (!this.args.samples.includes(value)) {
          throw new ValidationError(`THIS VALUE IS NOT CONTAINED IN SAMPLES. GIVEN: ${value}`);
        }

        return;
      }
      case 'none': {
        return;
      }
      default: {
        // @ts-expect-error
        throw new ValidationError(`THIS TYPE IN NOT UNDEFINED. GIVEN: ${this.args.type as string}`);
      }
    }
  }
}
