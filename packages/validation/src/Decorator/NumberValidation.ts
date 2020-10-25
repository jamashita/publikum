import { NumberValidationArgs, NumberValidationRule } from '../NumberValidationRule';
import { addRule } from './Validate';

export const NumberValidation = (args: NumberValidationArgs = {}): ParameterDecorator => {
  const v: NumberValidationRule = new NumberValidationRule(args);

  return (target: object, key: string | symbol) => {
    addRule(target, key, v);
  };
};
