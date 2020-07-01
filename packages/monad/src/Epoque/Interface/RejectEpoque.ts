export interface RejectEpoque<E> {
  reject(error: E): unknown;
}
