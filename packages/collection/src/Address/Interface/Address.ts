import { Nominative } from '@jamashita/publikum-interface';
import { ReadonlyAddress } from './ReadonlyAddress';

export interface Address<E extends Nominative<E>, N extends string = string>
  extends ReadonlyAddress<Address<E, N>, E, N> {
  add(element: E): Address<E, N>;

  remove(element: E): Address<E, N>;
}
