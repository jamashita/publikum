export interface IPresentExecutor<T> {
  onPresent(value: T): Promise<void>;
}
