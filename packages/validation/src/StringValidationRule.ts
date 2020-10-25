import { Kind } from '@jamashita/publikum-type';
import { ValidationError } from './Error/ValidationError';
import { ValidationRule } from './Interface/ValidationRule';

export type StringValidationArgs = Partial<Readonly<{
  min: number;
  max: number;
  pattern: RegExp;
}>>;

// TODO NUMERICAL STRING?
export class StringValidationRule implements ValidationRule {
  private readonly min?: number;
  private readonly max?: number;
  private readonly pattern?: RegExp;

  public constructor({ min, max, pattern }: StringValidationArgs) {
    this.min = min;
    this.max = max;
    this.pattern = pattern;
  }

  public evaluate(_target: object, value: unknown): void {
    if (!Kind.isString(value)) {
      throw new ValidationError(`VALUE IS NOT STRING. GIVEN: ${Kind.notate(value)}`);
    }
    if (!Kind.isUndefined(this.min)) {
      if (value.length < this.min) {
        throw new ValidationError(`VALUE IS SHORTER THAN min. GIVEN: ${value}`);
      }
    }
    if (!Kind.isUndefined(this.max)) {
      if (this.max < value.length) {
        throw new ValidationError(`VALUE IS LONGER THAN max. GIVEN: ${value}`);
      }
    }
    if (!Kind.isUndefined(this.pattern)) {
      if (!this.pattern.test(value)) {
        throw new ValidationError(`VALUE DOES NOT FOLLOW THE PATTERN. GIVEN: ${value}`);
      }
    }
  }
}
