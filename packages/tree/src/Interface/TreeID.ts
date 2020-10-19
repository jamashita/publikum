import { Nominative } from '@jamashita/publikum-interface';
import { Primitive } from '@jamashita/publikum-type';

export interface TreeID<N extends string = string> extends Nominative<N> {
  get(): Primitive;
}
