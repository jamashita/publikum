export type ErrorConstructor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new <E extends Error>(...args: Array<any>): E;
};
