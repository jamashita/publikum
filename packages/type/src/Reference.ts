import { Kind } from './Kind';

type Vague = Readonly<{
  [key: string]: unknown;
}>;

export class Reference {
  public static isCircular(value: unknown): boolean {
    return !Reference.isSerializable(value, new Set<unknown>());
  }

  private static isSerializable(value: unknown, visitStack: Set<unknown>): boolean {
    if (!Kind.isObject<Vague>(value)) {
      return true;
    }
    if (visitStack.has(value)) {
      return false;
    }

    visitStack.add(value);

    return Object.keys(value).every((key: string) => {
      return Reference.isSerializable(value[key], visitStack);
    });
  }

  private constructor() {
    // NOOP
  }
}
