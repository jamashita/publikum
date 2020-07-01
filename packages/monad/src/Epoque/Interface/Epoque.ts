export interface Epoque<V, E> {
  resolve(value: V): unknown;

  reject(error: E): unknown;
}
