import { Kind } from '@jamashita/publikum-type';
import { ValidationError, ValidationRule } from '@jamashita/publikum-validation';
import { Zeit } from './Zeit';

export type ZeitValidationArgs = Readonly<{
  format: string;
}>;

export class ZeitValidationRule implements ValidationRule {
  private readonly format: string;

  public constructor({ format }: ZeitValidationArgs) {
    this.format = format;
  }

  public evaluate(_target: object, value: unknown): void {
    if (!Kind.isString(value)) {
      throw new ValidationError(`VALUE IS NOT STRING. GIVEN: ${Kind.notate(value)}`);
    }
    if (!Zeit.validate(value, this.format)) {
      throw new ValidationError(`THIS STRING IS NOT SUITABLE FOR ZEIT. GIVEN: ${value} ${this.format}`);
    }
  }
}
