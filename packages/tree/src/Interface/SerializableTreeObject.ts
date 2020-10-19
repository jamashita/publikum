import { JSONable, Nominative } from '@jamashita/publikum-interface';

export interface SerializableTreeObject<N extends string = string> extends Nominative<N>, JSONable {
  // NOOP
}
