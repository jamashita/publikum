import { Kind } from '@jamashita/publikum-type';
import { ValidationError } from './Error/ValidationError';
import { ValidationRule } from './Interface/ValidationRule';

export class SymbolValidationRule implements ValidationRule {
  public evaluate(_target: object, value: unknown): void {
    if (!Kind.isSymbol(value)) {
      throw new ValidationError(`VALUE IS NOT SYMBOL. GIVEN: ${Kind.notate(value)}`);
    }
  }
}
