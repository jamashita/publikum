import { CancellableEnumerator, Collection, Pair, Quantity } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper, Nullable } from '@jamashita/publikum-type';
import { Tree } from './Tree';
import { TreeNode } from './TreeNode/TreeNode';

export abstract class Trees<K, V extends Nominative, T extends TreeNode<V, T>, E extends Tree<V, T>, C extends Collection<K, E>, N extends string = string> extends Quantity<K, E, N> {
  public abstract readonly noun: N;
  protected readonly trees: C;

  protected constructor(trees: C) {
    super();
    this.trees = trees;
  }

  public [Symbol.iterator](): Iterator<Pair<K, E>> {
    return this.trees[Symbol.iterator]();
  }

  public contains(value: E): boolean {
    return this.trees.contains(value);
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Trees)) {
      return false;
    }

    return this.trees.equals(other.trees);
  }

  public every(predicate: BinaryPredicate<E, K>): boolean {
    return this.trees.every(predicate);
  }

  public filter(predicate: BinaryPredicate<E, K>): Collection<K, E> {
    return this.trees.filter(predicate);
  }

  public find(predicate: BinaryPredicate<E, K>): Nullable<E> {
    return this.trees.find(predicate);
  }

  public forEach(iteration: CancellableEnumerator<K, E>): void {
    this.trees.forEach(iteration);
  }

  public get(key: K): Nullable<E> {
    return this.trees.get(key);
  }

  public isEmpty(): boolean {
    return this.trees.isEmpty();
  }

  public map<W extends Nominative>(mapper: Mapper<E, W>): Collection<K, W> {
    return this.trees.map<W>(mapper);
  }

  public serialize(): string {
    return this.trees.toString();
  }

  public size(): number {
    return this.trees.size();
  }

  public some(predicate: BinaryPredicate<E, K>): boolean {
    return this.trees.some(predicate);
  }

  public values(): Iterable<E> {
    return this.trees.values();
  }
}
