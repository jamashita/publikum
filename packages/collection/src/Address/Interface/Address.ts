import { Nominative } from '@jamashita/publikum-interface';
import { ReadonlyAddress } from './ReadonlyAddress';

export interface Address<V extends Nominative, N extends string = string> extends ReadonlyAddress<V, N> {
  add(element: V): Address<V, N>;

  remove(element: V): Address<V, N>;
}
