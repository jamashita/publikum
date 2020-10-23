import { Nominative } from '@jamashita/publikum-interface';
import { ReadonlyAddress } from './ReadonlyAddress';

export interface Address<V extends Nominative, N extends string = string> extends ReadonlyAddress<V, N> {
  add(value: V): Address<V, N>;

  remove(value: V): Address<V, N>;
}
