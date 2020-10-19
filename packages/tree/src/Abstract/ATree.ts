import { Nominative } from '@jamashita/publikum-interface';
import { ValueObject } from '@jamashita/publikum-object';
import { Tree } from '../Interface/Tree';
import { TreeNode } from '../TreeNode/Interface/TreeNode';

export abstract class ATree<V extends Nominative, T extends TreeNode<V, T>, N extends string> extends ValueObject<N> implements Tree<V, T, N> {
  public readonly noun: N;
  protected readonly root: T;

  protected constructor(root: T, noun: N) {
    super();
    this.root = root;
    this.noun = noun;
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
}
