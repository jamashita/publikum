import { Kind } from '@jamashita/publikum-type';
import { ValidationError } from './Error/ValidationError';
import { ValidationRule } from './Interface/ValidationRule';

// TODO OPTION
export class BigIntValidationRule implements ValidationRule {
  public evaluate(_target: object, value: unknown): void {
    if (!Kind.isBigInt(value)) {
      throw new ValidationError(`VALUE IS NOT BIGINT. GIVEN: ${Kind.notate(value)}`);
    }
  }
}
