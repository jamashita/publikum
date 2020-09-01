export interface DeadConstructor<E extends Error = Error> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(...args: ReadonlyArray<any>): E;
}
