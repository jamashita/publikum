import { ReadonlyAddress } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind, Nullable, Predicate } from '@jamashita/publikum-type';
import { TreeNode } from '../Interface/TreeNode';

export abstract class ATreeNode<V extends Nominative, N extends string = string> extends ValueObject<N> implements TreeNode<V, N> {
  public readonly noun: N;
  protected readonly value: V;
  protected readonly children: ReadonlyAddress<ATreeNode<V>>;

  protected constructor(value: V, children: ReadonlyAddress<ATreeNode<V>>, noun: N) {
    super();
    this.noun = noun;
    this.value = value;
    this.children = children;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof ATreeNode)) {
      return false;
    }
    if (!this.value.equals(other.value)) {
      return false;
    }
    if (!this.children.equals(other.children)) {
      return false;
    }

    return true;
  }

  public serialize(): string {
    if (this.isLeaf()) {
      return `{VALUE: ${this.value.toString()}}`;
    }

    return `{VALUE: ${this.value.toString()}, CHILDREN: [${this.children.toString()}]}`;
  }

  public getValue(): V {
    return this.value;
  }

  public getChildren(): ReadonlyAddress<ATreeNode<V>> {
    return this.children;
  }

  public isLeaf(): boolean {
    return this.children.isEmpty();
  }

  public contains(value: V): boolean {
    if (this.value.equals(value)) {
      return true;
    }

    return this.children.some((child: ATreeNode<V>) => {
      return child.contains(value);
    });
  }

  public size(): number {
    if (this.isLeaf()) {
      return 1;
    }

    let size: number = 1;

    this.children.forEach((child: ATreeNode<V>) => {
      size += child.size();
    });

    return size;
  }

  public find(predicate: Predicate<V>): Nullable<ATreeNode<V>> {
    if (predicate(this.value)) {
      return this;
    }

    for (const v of this.children.values()) {
      const n: Nullable<ATreeNode<V>> = v.find(predicate);

      if (!Kind.isNull(n)) {
        return n;
      }
    }

    return null;
  }
}
