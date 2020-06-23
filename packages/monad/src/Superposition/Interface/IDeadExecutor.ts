export interface IDeadExecutor<F extends Error> {
  onDead(err: F): Promise<void>;
}
