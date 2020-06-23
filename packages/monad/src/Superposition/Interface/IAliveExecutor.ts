export interface IAliveExecutor<S> {
  onAlive(value: S): Promise<void>;
}
