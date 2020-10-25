import { Ambiguous, Kind } from '@jamashita/publikum-type';
import 'reflect-metadata';
import { ValidationRule } from '../Interface/ValidationRule';

const VALIDATION_KEY: symbol = Symbol();

const getRules = (target: object, key: string | symbol): Array<ValidationRule> => {
  const rules: Ambiguous<Array<ValidationRule>> = Reflect.getMetadata(VALIDATION_KEY, target, key) as Ambiguous<Array<ValidationRule>>;

  if (Kind.isUndefined(rules)) {
    return [];
  }

  return rules;
};

const getKeys = (target: object): Set<string | symbol> => {
  const properties: Ambiguous<Set<string | symbol>> = Reflect.getMetadata(VALIDATION_KEY, target) as Ambiguous<Set<string | symbol>>;

  if (Kind.isUndefined(properties)) {
    return new Set<string | symbol>();
  }

  return properties;
};

// TODO TESSTS!!!
export const Validate = (): MethodDecorator => {
  return <T>(target: object, _k: string | symbol, descriptor: TypedPropertyDescriptor<T>): void => {
    getKeys(target).forEach((key: string | symbol) => {
      getRules(target, key).forEach((rule: ValidationRule) => {
        if (Kind.isString(key)) {
          if (Kind.isFunction(descriptor.value)) {
            const method: Function = descriptor.value;

            // @ts-expect-error
            descriptor.value = (...args: Array<unknown>) => {
              rule.evaluate(target, args[0], key);

              method.apply(method, args);
            };
          }
        }
      });
    });
  };
};

export const addRule = (target: object, key: string | symbol, rule: ValidationRule): void => {
  const rules: Array<ValidationRule> = getRules(target, key);
  const properties: Set<string | symbol> = getKeys(target);

  rules.push(rule);

  if (!properties.has(key)) {
    properties.add(key);
  }

  Reflect.defineMetadata(VALIDATION_KEY, rules, target, key);
  Reflect.defineMetadata(VALIDATION_KEY, properties, target);
};
