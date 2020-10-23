import { ReadonlyAddress } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind, Nullable, Predicate } from '@jamashita/publikum-type';
import { TreeNode } from '../Interface/TreeNode';

export abstract class ATreeNode<V extends Nominative, T extends ATreeNode<V, T>, N extends string = string> extends ValueObject<N> implements TreeNode<V, T, N> {
  public readonly noun: N;
  protected readonly value: V;
  protected readonly children: ReadonlyAddress<T>;

  protected constructor(value: V, children: ReadonlyAddress<T>, noun: N) {
    super();
    this.noun = noun;
    this.value = value;
    this.children = children;
  }

  public abstract set(parent: T, value: V): TreeNode<V, T, N>;

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

  public getChildren(): ReadonlyAddress<T> {
    return this.children;
  }

  public isLeaf(): boolean {
    return this.children.isEmpty();
  }

  public contains(value: V): boolean {
    if (this.value.equals(value)) {
      return true;
    }

    return this.children.some((child: T) => {
      return child.contains(value);
    });
  }

  public size(): number {
    if (this.isLeaf()) {
      return 1;
    }

    let size: number = 0;

    this.children.forEach((child: T) => {
      size += child.size();
    });

    return size;
  }

  public find(predicate: Predicate<V>): Nullable<V> {
    if (predicate(this.value)) {
      return this.value;
    }

    const n: Nullable<T> = this.children.find((child: T) => {
      return !Kind.isNull(child.find(predicate));
    });

    if (Kind.isNull(n)) {
      return null;
    }

    return n.value;
  }
}
