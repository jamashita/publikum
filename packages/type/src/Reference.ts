type Vague = Readonly<{
  [key: string]: unknown;
}>;

export class Reference {
  public static isCircular(value: unknown): boolean {
    return !Reference.isSerializable(value, new Set<unknown>());
  }

  private static isObject(value: unknown): value is object {
    if (typeof value !== 'object') {
      return false;
    }
    if (value === null) {
      return false;
    }

    return true;
  }

  private static isSerializable(value: unknown, visitStack: Set<unknown>): boolean {
    if (!Reference.isObject(value)) {
      return true;
    }
    if (visitStack.has(value)) {
      return false;
    }

    visitStack.add(value);

    const v: Vague = value as Vague;

    return Object.keys(value).every((key: string) => {
      return Reference.isSerializable(v[key], visitStack);
    });
  }

  private constructor() {
    // NOOP
  }
}
