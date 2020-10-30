import { Kind } from '@jamashita/publikum-type';
import { ValidationError } from './Error/ValidationError';
import { ValidationRule } from './Interface/ValidationRule';

type NumberCondition = Readonly<{
  condition: 't' | 'te';
  value: number;
}>;

export type BigIntValidationArgs = Partial<Readonly<{
  min: NumberCondition;
  max: NumberCondition;
}>>;

export class BigIntValidationRule implements ValidationRule {
  private readonly min?: NumberCondition;
  private readonly max?: NumberCondition;

  public static of(args: BigIntValidationArgs = {}): BigIntValidationRule {
    return new BigIntValidationRule(args);
  }

  protected constructor({ min, max }: BigIntValidationArgs) {
    this.min = min;
    this.max = max;
  }

  public evaluate(_target: object, value: unknown): void {
    if (!Kind.isBigInt(value)) {
      throw new ValidationError(`VALUE IS NOT BIGINT. GIVEN: ${Kind.notate(value)}`);
    }

    this.minCondition(value);
    this.maxCondition(value);
  }

  private minCondition(value: bigint): void {
    if (Kind.isUndefined(this.min)) {
      return;
    }

    const minBigInt: bigint = BigInt(this.min.value);

    switch (this.min.condition) {
      case 't': {
        if (value < minBigInt) {
          throw new ValidationError(`VALUE IS SHORTER THAN min. GIVEN: ${value}`);
        }

        return;
      }
      case 'te': {
        if (value <= minBigInt) {
          throw new ValidationError(`VALUE IS SHORTER THAN OR EQUALS TO min. GIVEN: ${value}`);
        }

        return;
      }
      default: {
        throw new ValidationError(`THIS CONDITION IN NOT UNDEFINED. GIVEN: ${this.min.condition as string}`);
      }
    }
  }

  private maxCondition(value: bigint): void {
    if (Kind.isUndefined(this.max)) {
      return;
    }

    const maxBigInt: bigint = BigInt(this.max.value);

    switch (this.max.condition) {
      case 't': {
        if (maxBigInt < value) {
          throw new ValidationError(`VALUE IS LONGER THAN max. GIVEN: ${value}`);
        }

        return;
      }
      case 'te': {
        if (maxBigInt <= value) {
          throw new ValidationError(`VALUE IS LONGER THAN OR EQUALS TO max. GIVEN: ${value}`);
        }

        return;
      }
      default: {
        throw new ValidationError(`THIS CONDITION IN NOT UNDEFINED. GIVEN: ${this.max.condition as string}`);
      }
    }
  }
}
