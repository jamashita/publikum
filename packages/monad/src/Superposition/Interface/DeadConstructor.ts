export interface DeadConstructor<E extends Error> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: Array<any>): E;
}
