import { Kind } from '@jamashita/publikum-type';
import { ValidationError } from '../Error/ValidationError';
import { ValidationRule } from '../ValidationRule';

export type StringValidatorArgs = Partial<Readonly<{
  min: number;
  max: number;
  pattern: RegExp;
}>>;

export class StringValidationRule implements ValidationRule {
  private readonly args: StringValidatorArgs;

  public constructor(args: StringValidatorArgs) {
    this.args = args;
  }

  public evaluate(_target: object, value: unknown): void {
    if (!Kind.isString(value)) {
      throw new ValidationError(`VALUE IS NOT STRING. GIVEN: ${Kind.notate(value)}`);
    }
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
    if (!Kind.isUndefined(this.args.pattern)) {
      if (!this.args.pattern.test(value)) {
        throw new ValidationError(`VALUE DOES NOT FOLLOW THE PATTERN. GIVEN: ${value}`);
      }
    }
  }
}
