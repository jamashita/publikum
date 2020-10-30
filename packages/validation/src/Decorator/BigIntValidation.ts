import { BigIntValidationArgs, BigIntValidationRule } from '../BigIntValidationRule';
import { addRule } from './Validate';

export const BigIntValidation = (args: BigIntValidationArgs = {}): ParameterDecorator => {
  const v: BigIntValidationRule = new BigIntValidationRule(args);

  return (target: object, key: string | symbol, index: number) => {
    addRule(target, key, index, v);
  };
};
