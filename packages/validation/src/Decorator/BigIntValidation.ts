import { BigIntValidationRule } from '../BigIntValidationRule';
import { addRule } from './Validate';

export const BigIntValidation = (): ParameterDecorator => {
  const v: BigIntValidationRule = new BigIntValidationRule();

  return (target: object, key: string | symbol, index: number) => {
    addRule(target, key, index, v);
  };
};
