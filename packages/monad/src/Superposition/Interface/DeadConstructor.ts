export interface DeadConstructor<E extends Error = Error> extends ErrorConstructor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: Array<any>): E;
}
