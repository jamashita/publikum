import { Kind } from '@jamashita/publikum-type';
import { ValidationError } from './Error/ValidationError';
import { ValidationRule } from './Interface/ValidationRule';

export type NumberValidatorArgs = Partial<Readonly<{
  min: number;
  max: number;
  int: boolean;
  noNaN: boolean;
  noInfinity: boolean;
}>>;

export class NumberValidationRule implements ValidationRule {
  private readonly min?: number;
  private readonly max?: number;
  private readonly int: boolean;
  private readonly noNaN: boolean;
  private readonly noInfinity: boolean;

  public constructor({ min, max, int = false, noNaN = false, noInfinity = false }: NumberValidatorArgs) {
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
    if (!Kind.isUndefined(this.min)) {
      if (value < this.min) {
        throw new ValidationError(`VALUE IS SHORTER THAN min. GIVEN: ${value}`);
      }
    }
    if (!Kind.isUndefined(this.max)) {
      if (this.max < value) {
        throw new ValidationError(`VALUE IS LONGER THAN max. GIVEN: ${value}`);
      }
    }
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
        throw new ValidationError('VALUE IS Inifinity');
      }
    }
  }
}
