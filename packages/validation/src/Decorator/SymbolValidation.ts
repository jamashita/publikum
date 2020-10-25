import { SymbolValidationRule } from '../SymbolValidationRule';
import { addRule } from './Validate';

export const SymbolValidation = (): ParameterDecorator => {
  const v: SymbolValidationRule = new SymbolValidationRule();

  return (target: object, key: string | symbol) => {
    addRule(target, key, v);
  };
};
