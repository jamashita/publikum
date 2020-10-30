import { NumberValidationArgs, NumberValidationRule } from '../NumberValidationRule';
import { addRule } from './Validate';

export const NumberValidation = (args: NumberValidationArgs = {}): ParameterDecorator => {
  const v: NumberValidationRule = NumberValidationRule.of(args);

  return (target: object, key: string | symbol, index: number) => {
    addRule(target, key, index, v);
  };
};
