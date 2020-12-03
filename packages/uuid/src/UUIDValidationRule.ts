import { Kind } from '@jamashita/publikum-type';
import { ValidationError, ValidationRule } from '@jamashita/publikum-validation';
import { UUID } from './UUID';

export class UUIDValidationRule implements ValidationRule {
  public evaluate(_target: object, value: unknown): void {
    if (!Kind.isString(value)) {
      throw new ValidationError('VALUE IS NOT STRING');
    }
    if (!UUID.validate(value)) {
      throw new ValidationError(`THIS STRING IS NOT SUITABLE FOR UUID. GIVEN: ${value}`);
    }
  }
}
