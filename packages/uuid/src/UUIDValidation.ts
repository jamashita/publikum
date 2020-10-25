import { addRule } from '@jamashita/publikum-validation';
import { UUIDValidationRule } from './UUIDValidationRule';

export const UUIDValidation = (): ParameterDecorator => {
  const v: UUIDValidationRule = new UUIDValidationRule();

  return (target: object, key: string | symbol): void => {
    addRule(target, key, v);
  };
};
