import { ImmutableAddress } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { Nullable, Predicate } from '@jamashita/publikum-type';

export interface TreeNode<V extends Nominative, T extends TreeNode<V, T>, N extends string = string> extends Nominative<N> {
  getValue(): V;

  getChildren(): ImmutableAddress<T>;

  isLeaf(): boolean;

  contains(value: V): boolean;

  size(): number;

  find(predicate: Predicate<V>): Nullable<T>;

  values(): Iterable<V>;
}
