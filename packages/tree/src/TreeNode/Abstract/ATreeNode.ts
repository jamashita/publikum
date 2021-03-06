import { ImmutableAddress } from '@jamashita/publikum-collection';
import { isEqualable } from '@jamashita/publikum-interface';
import { Objet } from '@jamashita/publikum-object';
import { Kind, Nullable, Predicate } from '@jamashita/publikum-type';
import { TreeNode } from '../Interface/TreeNode';

export abstract class ATreeNode<V, T extends ATreeNode<V, T>, N extends string = string> extends Objet<N> implements TreeNode<V> {
  protected readonly value: V;
  protected children: ImmutableAddress<T>;

  protected constructor(value: V, children: ImmutableAddress<T>) {
    super();
    this.value = value;
    this.children = children;
  }

  protected abstract forge(node: ATreeNode<V, T>): T;

  public abstract append(node: T): T;

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof ATreeNode)) {
      return false;
    }
    if (!this.valueEquals(other.value)) {
      return false;
    }
    if (!this.children.equals(other.children)) {
      return false;
    }

    return true;
  }

  public serialize(): string {
    if (this.isLeaf()) {
      return `{VALUE: ${Objet.identify(this.value)}}`;
    }

    return `{VALUE: ${Objet.identify(this.value)}, CHILDREN: [${this.children.toString()}]}`;
  }

  public getValue(): V {
    return this.value;
  }

  public getChildren(): ImmutableAddress<T> {
    return this.children;
  }

  public isLeaf(): boolean {
    return this.children.isEmpty();
  }

  public contains(value: V): boolean {
    if (this.valueEquals(value)) {
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

    let size: number = 1;

    this.children.forEach((child: T) => {
      size += child.size();
    });

    return size;
  }

  public find(predicate: Predicate<V>): Nullable<T> {
    if (predicate(this.value)) {
      return this.forge(this);
    }

    for (const v of this.children.values()) {
      const n: Nullable<T> = v.find(predicate);

      if (!Kind.isNull(n)) {
        return n;
      }
    }

    return null;
  }

  public values(): Iterable<V> {
    if (this.isLeaf()) {
      return [this.value];
    }

    const values: Array<V> = [];

    this.valuesInternal(values);

    return values;
  }

  private valueEquals(other: unknown): boolean {
    if (this.value === other) {
      return true;
    }
    if (isEqualable(this.value)) {
      return this.value.equals(other);
    }

    return false;
  }

  private valuesInternal(values: Array<V>): void {
    values.push(this.value);

    this.getChildren().forEach((child: T) => {
      child.valuesInternal(values);
    });
  }
}
