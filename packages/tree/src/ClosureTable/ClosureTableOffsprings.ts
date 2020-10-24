import {
  CancellableEnumerator,
  Collection,
  ImmutableAddress,
  MutableAddress,
  Pair,
  Quantity,
  ReadonlyAddress
} from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper, Nullable } from '@jamashita/publikum-type';

export class ClosureTableOffsprings<K extends Nominative> extends Quantity<void, K, 'ClosureTableOffsprings'> {
  public readonly noun: 'ClosureTableOffsprings' = 'ClosureTableOffsprings';
  private readonly offsprings: ImmutableAddress<K>;

  private static readonly EMPTY: ClosureTableOffsprings<Nominative> = new ClosureTableOffsprings<Nominative>(ImmutableAddress.empty<Nominative>());

  public static of<KT extends Nominative>(offsprings: ReadonlyAddress<KT>): ClosureTableOffsprings<KT> {
    if (offsprings.size() === 0) {
      return ClosureTableOffsprings.empty<KT>();
    }

    return new ClosureTableOffsprings<KT>(ImmutableAddress.of<KT>(offsprings));
  }

  public static ofArray<KT extends Nominative>(offsprings: ReadonlyArray<KT>): ClosureTableOffsprings<KT> {
    const address: MutableAddress<KT> = MutableAddress.empty<KT>();

    offsprings.forEach((offspring: KT) => {
      address.add(offspring);
    });

    return ClosureTableOffsprings.of<KT>(address);
  }

  public static empty<KT extends Nominative>(): ClosureTableOffsprings<KT> {
    return ClosureTableOffsprings.EMPTY as ClosureTableOffsprings<KT>;
  }

  protected constructor(offsprings: ImmutableAddress<K>) {
    super();
    this.offsprings = offsprings;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof ClosureTableOffsprings)) {
      return false;
    }

    return this.offsprings.equals(other.offsprings);
  }

  public serialize(): string {
    return this.offsprings.toString();
  }

  public size(): number {
    return this.offsprings.size();
  }

  public values(): Iterable<K> {
    return this.offsprings.values();
  }

  public [Symbol.iterator](): Iterator<Pair<void, K>> {
    return this.offsprings[Symbol.iterator]();
  }

  public contains(value: K): boolean {
    return this.offsprings.contains(value);
  }

  public every(predicate: BinaryPredicate<K, void>): boolean {
    return this.offsprings.every(predicate);
  }

  public forEach(iteration: CancellableEnumerator<void, K>): void {
    this.offsprings.forEach(iteration);
  }

  public get(): Nullable<K> {
    return null;
  }

  public isEmpty(): boolean {
    return this.offsprings.isEmpty();
  }

  public some(predicate: BinaryPredicate<K, void>): boolean {
    return this.offsprings.some(predicate);
  }

  public filter(predicate: BinaryPredicate<K, void>): Collection<void, K> {
    return this.offsprings.filter(predicate);
  }

  public find(predicate: BinaryPredicate<K, void>): Nullable<K> {
    return this.offsprings.find(predicate);
  }

  public map<W extends Nominative>(mapper: Mapper<K, W>): ImmutableAddress<W> {
    return this.offsprings.map<W>(mapper);
  }

  public isLeaf(): boolean {
    if (this.offsprings.size() === 1) {
      return true;
    }

    return false;
  }

  public compare(other: ClosureTableOffsprings<K>): number {
    return this.offsprings.size() - other.offsprings.size();
  }
}
