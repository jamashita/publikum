import { ReadonlyAddress } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { ValueObject } from '@jamashita/publikum-object';
import { TreeNode } from '../Interface/TreeNode';

export abstract class ATreeNode<V extends Nominative, T extends TreeNode<V, T>, N extends string> extends ValueObject<N> implements TreeNode<V, T, N> {
  public readonly noun: N;
  protected readonly value: V;
  protected readonly children: ReadonlyAddress<T>;

  protected constructor(value: V, children: ReadonlyAddress<T>, noun: N) {
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

  public getChildren(): ReadonlyAddress<T> {
    return this.children;
  }

  public isLeaf(): boolean {
    return this.children.isEmpty();
  }
}
