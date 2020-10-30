import { Kind } from '@jamashita/publikum-type';
import { ValidationError } from './Error/ValidationError';
import { ValidationRule } from './Interface/ValidationRule';

export class BooleanValidationRule implements ValidationRule {
  private static readonly INSTANCE: BooleanValidationRule = new BooleanValidationRule();

  public static of(): BooleanValidationRule {
    return BooleanValidationRule.INSTANCE;
  }

  protected constructor() {
    // NOOP
  }

  public evaluate(_target: object, value: unknown): void {
    if (!Kind.isBoolean(value)) {
      throw new ValidationError(`VALUE IS NOT BOOLEAN. GIVEN: ${Kind.notate(value)}`);
    }
  }
}
