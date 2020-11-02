import { Nominative } from '@jamashita/publikum-interface';
import { Objet } from '@jamashita/publikum-object';
import { Nullable, Predicate } from '@jamashita/publikum-type';
import { Tree } from '../Tree';
import { TreeNode } from '../TreeNode/TreeNode';

export abstract class ATree<V extends Nominative, T extends TreeNode<V, T>, N extends string = string> extends Objet<N> implements Tree<V, T> {
  protected readonly root: T;

  protected constructor(root: T) {
    super();
    this.root = root;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof ATree)) {
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

  public values(): Iterable<V> {
    return this.root.values();
  }

  public every(predicate: Predicate<V>): boolean {
    return this.everyInternal(this.root, predicate);
  }

  public some(predicate: Predicate<V>): boolean {
    return this.someInternal(this.root, predicate);
  }

  private everyInternal(node: T, predicate: Predicate<V>): boolean {
    if (!predicate(node.getValue())) {
      return false;
    }
    if (node.isLeaf()) {
      return true;
    }

    return node.getChildren().every((child: T) => {
      return this.everyInternal(child, predicate);
    });
  }

  private someInternal(node: T, predicate: Predicate<V>): boolean {
    if (predicate(node.getValue())) {
      return true;
    }
    if (node.isLeaf()) {
      return false;
    }

    return node.getChildren().some((n: T) => {
      return this.someInternal(n, predicate);
    });
  }
}
