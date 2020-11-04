import { ImmutableAddress } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { Nullable, Predicate } from '@jamashita/publikum-type';

export interface ReadonlyTreeNode<V extends Nominative, N extends string = string> extends Nominative<N> {
  getValue(): V;

  getChildren(): ImmutableAddress<ReadonlyTreeNode<V>>;

  isLeaf(): boolean;

  contains(value: V): boolean;

  size(): number;

  find(predicate: Predicate<V>): Nullable<ReadonlyTreeNode<V>>;

  values(): Iterable<V>;
}
