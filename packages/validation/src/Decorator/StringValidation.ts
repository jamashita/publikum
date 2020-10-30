import { StringValidationArgs, StringValidationRule } from '../StringValidationRule';
import { addRule } from './Validate';

export const StringValidation = (args?: StringValidationArgs): ParameterDecorator => {
  const v: StringValidationRule = StringValidationRule.of(args);

  return (target: object, key: string | symbol, index: number) => {
    addRule(target, key, index, v);
  };
};
