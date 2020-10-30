import { SymbolValidationRule } from '../SymbolValidationRule';
import { addRule } from './Validate';

export const SymbolValidation = (): ParameterDecorator => {
  const v: SymbolValidationRule = SymbolValidationRule.of();

  return (target: object, key: string | symbol, index: number) => {
    addRule(target, key, index, v);
  };
};
