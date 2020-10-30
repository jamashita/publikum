import { Kind } from '@jamashita/publikum-type';
import { ValidationError } from './Error/ValidationError';
import { ValidationRule } from './Interface/ValidationRule';

type NumberCondition = Readonly<{
  condition: 't' | 'te';
  value: number;
}>;

export type NumberValidationArgs = Partial<Readonly<{
  min: NumberCondition;
  max: NumberCondition;
  int: boolean;
  noNaN: boolean;
  noInfinity: boolean;
}>>;

export class NumberValidationRule implements ValidationRule {
  private readonly min?: NumberCondition;
  private readonly max?: NumberCondition;
  private readonly int: boolean;
  private readonly noNaN: boolean;
  private readonly noInfinity: boolean;

  public static of(args: NumberValidationArgs): NumberValidationRule {
    return new NumberValidationRule(args);
  }

  protected constructor({ min, max, int = false, noNaN = false, noInfinity = false }: NumberValidationArgs) {
    this.min = min;
    this.max = max;
    this.int = int;
    this.noNaN = noNaN;
    this.noInfinity = noInfinity;
  }

  public evaluate(_target: object, value: unknown): void {
    if (!Kind.isNumber(value)) {
      throw new ValidationError(`VALUE IS NOT NUMBER. GIVEN: ${Kind.notate(value)}`);
    }

    this.minCondition(value);
    this.maxCondition(value);

    if (this.int) {
      if (!Kind.isInteger(value)) {
        throw new ValidationError(`VALUE IS INTEGER. GIVEN: ${value}`);
      }
    }
    if (this.noNaN) {
      if (Kind.isNaN(value)) {
        throw new ValidationError('VALUE IS NaN');
      }
    }
    if (this.noInfinity) {
      if (value === Infinity || value === -Infinity) {
        throw new ValidationError('VALUE IS Infinity');
      }
    }
  }

  private minCondition(value: number): void {
    if (Kind.isUndefined(this.min)) {
      return;
    }

    switch (this.min.condition) {
      case 't': {
        if (value < this.min.value) {
          throw new ValidationError(`VALUE IS SHORTER THAN min. GIVEN: ${value}`);
        }

        return;
      }
      case 'te': {
        if (value <= this.min.value) {
          throw new ValidationError(`VALUE IS SHORTER THAN OR EQUALS min. GIVEN: ${value}`);
        }

        return;
      }
      default: {
        throw new ValidationError(`THIS CONDITION IN NOT UNDEFINED. GIVEN: ${this.min.condition as string}`);
      }
    }
  }

  private maxCondition(value: number): void {
    if (Kind.isUndefined(this.max)) {
      return;
    }

    switch (this.max.condition) {
      case 't': {
        if (this.max.value < value) {
          throw new ValidationError(`VALUE IS LONGER THAN max. GIVEN: ${value}`);
        }

        return;
      }
      case 'te': {
        if (this.max.value <= value) {
          throw new ValidationError(`VALUE IS LONGER THAN OR EQUALS max. GIVEN: ${value}`);
        }

        return;
      }
      default: {
        throw new ValidationError(`THIS CONDITION IN NOT UNDEFINED. GIVEN: ${this.max.condition as string}`);
      }
    }
  }
}
