import { BooleanValidationRule } from '../BooleanValidationRule';
import { addRule } from './Validate';

export const BooleanValidation = (): ParameterDecorator => {
  const v: BooleanValidationRule = new BooleanValidationRule();

  return (target: object, key: string | symbol, index: number) => {
    addRule(target, key, index, v);
  };
};
