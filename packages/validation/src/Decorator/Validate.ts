import { Ambiguous, Kind } from '@jamashita/publikum-type';
import 'reflect-metadata';
import { ValidationRule } from '../Interface/ValidationRule';

const INDEX_KEY: symbol = Symbol();
const RULE_KEY: symbol = Symbol();

const getIndex = (target: object, key: string | symbol): Ambiguous<Set<number>> => {
  return Reflect.getOwnMetadata(INDEX_KEY, target, key) as Ambiguous<Set<number>>;
};

const getRules = (target: object, key: string | symbol): Ambiguous<Map<number, ValidationRule>> => {
  return Reflect.getOwnMetadata(RULE_KEY, target, key) as Ambiguous<Map<number, ValidationRule>>;
};

export const Validate = (): MethodDecorator => {
  return <T>(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>): void => {
    const indice: Ambiguous<Set<number>> = getIndex(target, key);

    if (Kind.isUndefined(indice)) {
      return;
    }

    const rules: Ambiguous<Map<number, ValidationRule>> = getRules(target, key);

    if (Kind.isUndefined(rules)) {
      return;
    }

    indice.forEach((index: number) => {
      rules.forEach((rule: ValidationRule, i: number) => {
        if (index !== i) {
          return;
        }
        if (!Kind.isFunction(descriptor.value)) {
          return;
        }

        const method: Function = descriptor.value;

        // @ts-expect-error
        descriptor.value = (...args: Array<unknown>) => {
          rule.evaluate(target, args[i], key);

          method.apply(method, args);
        };
      });
    });
  };
};

export const addRule = (target: object, key: string | symbol, index: number, rule: ValidationRule): void => {
  const indice: Ambiguous<Set<number>> = getIndex(target, key);
  const rules: Ambiguous<Map<number, ValidationRule>> = getRules(target, key);

  if (Kind.isUndefined(indice)) {
    const s: Set<number> = new Set<number>();

    s.add(index);

    Reflect.defineMetadata(INDEX_KEY, s, target, key);
  }
  else {
    indice.add(index);
  }

  if (Kind.isUndefined(rules)) {
    const r: Map<number, ValidationRule> = new Map<number, ValidationRule>();

    r.set(index, rule);

    Reflect.defineMetadata(RULE_KEY, r, target, key);
  }
  else {
    rules.set(index, rule);
  }
};
