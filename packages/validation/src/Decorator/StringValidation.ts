import { StringValidationRule, StringValidatorArgs } from '../StringValidationRule';
import { addRule } from './Validate';

export const StringValidation = (args: StringValidatorArgs = {}): ParameterDecorator => {
  const v: StringValidationRule = new StringValidationRule(args);

  return (target: object, key: string | symbol) => {
    addRule(target, key, v);
  };
};
