import { RejectEpoque } from './RejectEpoque';
import { ResolveEpoque } from './ResolveEpoque';

export interface Epoque<V, E> extends ResolveEpoque<V>, RejectEpoque<E> {
  resolve(value: V): unknown;

  reject(error: E): unknown;
}
