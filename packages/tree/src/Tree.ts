import { Nominative } from '@jamashita/publikum-interface';
import { Objet } from '@jamashita/publikum-object';
import { Nullable, Predicate } from '@jamashita/publikum-type';
import { TreeNode } from './TreeNode/TreeNode';

export abstract class Tree<V extends Nominative, T extends TreeNode<V, T>, N extends string = string> extends Objet<N> {
  protected readonly root: T;

  protected constructor(root: T) {
    super();
    this.root = root;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Tree)) {
      return false;
    }

    return this.root.equals(other.root);
  }

  public serialize(): string {
    return this.root.toString();
  }

  public getRoot(): T {
    return this.root;
  }

  public contains(value: V): boolean {
    return this.root.contains(value);
  }

  public find(predicate: Predicate<V>): Nullable<T> {
    return this.root.find(predicate);
  }

  public size(): number {
    return this.root.size();
  }
}
