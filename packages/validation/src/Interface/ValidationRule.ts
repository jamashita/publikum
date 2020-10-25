export interface ValidationRule {
  evaluate(target: object, value: unknown, key: string | symbol): void;
}
