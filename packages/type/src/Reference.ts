import { Kind } from './Kind';
import { Inconnu } from './Value';

export class Reference {
  public static isCircular(value: unknown): boolean {
    return !Reference.isSerializable(value, new WeakSet<object>());
  }

  private static isSerializable(value: unknown, visitStack: WeakSet<object>): boolean {
    if (!Kind.isObject<Inconnu>(value)) {
      return true;
    }
    if (visitStack.has(value)) {
      return false;
    }

    visitStack.add(value);

    return !Object.keys(value).some((key: string) => {
      return !Reference.isSerializable(value[key], visitStack);
    });
  }

  private constructor() {
    // NOOP
  }
}
