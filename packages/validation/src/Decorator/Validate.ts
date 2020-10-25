import { Kind } from '@jamashita/publikum-type';
import { ValidationRule } from '../Interface/ValidationRule';
import { getKeys, getRules } from '../Validator';

export const Validate = (): MethodDecorator => {
  return <T>(target: object, _k: string | symbol, descriptor: TypedPropertyDescriptor<T>): void => {
    getKeys(target).forEach((key: string | symbol) => {
      getRules(target, key).forEach((rule: ValidationRule) => {
        if (Kind.isString(key)) {
          if (Kind.isFunction(descriptor.value)) {
            const method: Function = descriptor.value;

            // @ts-expect-error
            descriptor.value = (...args: Array<unknown>) => {
              // @ts-expect-error
              rule.evaluate(target, target[key], key);

              Reflect.apply(method, descriptor.value, args);
            };
          }
        }
      });
    });
  };
};
