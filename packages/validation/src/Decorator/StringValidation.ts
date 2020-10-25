import { StringValidationArgs, StringValidationRule } from '../StringValidationRule';
import { addRule } from './Validate';

export const StringValidation = (args: StringValidationArgs = {}): ParameterDecorator => {
  const v: StringValidationRule = new StringValidationRule(args);

  return (target: object, key: string | symbol, index: number) => {
    addRule(target, key, index, v);
  };
};
