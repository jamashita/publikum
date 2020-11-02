import { Nominative } from '@jamashita/publikum-interface';
import { Enumerator, Nullable, Predicate } from '@jamashita/publikum-type';
import { TreeNode } from './TreeNode/TreeNode';

export interface Tree<V extends Nominative, T extends TreeNode<V, T>, N extends string = string> extends Nominative<N> {
  getRoot(): T;

  contains(value: V): boolean;

  every(predicate: Predicate<V>): boolean;

  forEach(iteration: Enumerator<unknown, V>): void;

  find(predicate: Predicate<V>): Nullable<T>;

  size(): number;

  some(predicate: Predicate<V>): boolean;

  values(): Iterable<V>;
}
