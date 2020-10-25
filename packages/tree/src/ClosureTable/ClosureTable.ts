import {
  CancellableEnumerator,
  ImmutableProject,
  ImmutableSequence,
  MutableAddress,
  MutableProject,
  Pair,
  Quantity,
  ReadonlySequence
} from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface/src';
import { BinaryPredicate, Kind, Mapper, Nullable } from '@jamashita/publikum-type';
import { TreeID } from '../Interface/TreeID';
import { ClosureTableHierarchies } from './ClosureTableHierarchies';
import { ClosureTableHierarchy } from './ClosureTableHierarchy';
import { ClosureTableOffsprings } from './ClosureTableOffsprings';

export class ClosureTable<K extends TreeID> extends Quantity<K, ClosureTableOffsprings<K>, 'ClosureTable'> {
  public readonly noun: 'ClosureTable' = 'ClosureTable';
  private readonly table: ImmutableProject<K, ClosureTableOffsprings<K>>;

  private static readonly EMPTY: ClosureTable<TreeID> = new ClosureTable<TreeID>(ImmutableProject.empty<TreeID, ClosureTableOffsprings<TreeID>>());

  public static of<KT extends TreeID>(hierarchies: ClosureTableHierarchies<KT>): ClosureTable<KT> {
    if (hierarchies.isEmpty()) {
      return ClosureTable.empty<KT>();
    }

    const project: MutableProject<KT, MutableAddress<KT>> = MutableProject.empty<KT, MutableAddress<KT>>();

    hierarchies.forEach((hierarchy: ClosureTableHierarchy<KT>) => {
      const offsprings: Nullable<MutableAddress<KT>> = project.get(hierarchy.getAncestor());

      if (Kind.isNull(offsprings)) {
        const address: MutableAddress<KT> = MutableAddress.empty<KT>();

        address.add(hierarchy.getOffspring());
        project.set(hierarchy.getAncestor(), address);

        return;
      }

      offsprings.add(hierarchy.getOffspring());
    });

    const table: MutableProject<KT, ClosureTableOffsprings<KT>> = project.map<ClosureTableOffsprings<KT>>((offsprings: MutableAddress<KT>) => {
      return ClosureTableOffsprings.of<KT>(offsprings);
    });

    return new ClosureTable<KT>(ImmutableProject.of<KT, ClosureTableOffsprings<KT>>(table));
  }

  public static empty<KT extends TreeID>(): ClosureTable<KT> {
    return ClosureTable.EMPTY as ClosureTable<KT>;
  }

  protected constructor(table: ImmutableProject<K, ClosureTableOffsprings<K>>) {
    super();
    this.table = table;
  }

  public [Symbol.iterator](): Iterator<Pair<K, ClosureTableOffsprings<K>>> {
    return this.table[Symbol.iterator]();
  }

  public contains(value: ClosureTableOffsprings<K>): boolean {
    return this.table.contains(value);
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof ClosureTable)) {
      return false;
    }

    return this.table.equals(other.table);
  }

  public every(predicate: BinaryPredicate<ClosureTableOffsprings<K>, K>): boolean {
    return this.table.every(predicate);
  }

  public forEach(iteration: CancellableEnumerator<K, ClosureTableOffsprings<K>>): void {
    this.table.forEach(iteration);
  }

  public get(key: K): Nullable<ClosureTableOffsprings<K>> {
    return this.table.get(key);
  }

  public isEmpty(): boolean {
    return this.table.isEmpty();
  }

  public serialize(): string {
    return this.table.toString();
  }

  public size(): number {
    return this.table.size();
  }

  public some(predicate: BinaryPredicate<ClosureTableOffsprings<K>, K>): boolean {
    return this.table.some(predicate);
  }

  public values(): Iterable<ClosureTableOffsprings<K>> {
    return this.table.values();
  }

  public filter(predicate: BinaryPredicate<ClosureTableOffsprings<K>, K>): ImmutableProject<K, ClosureTableOffsprings<K>> {
    return this.table.filter(predicate);
  }

  public find(predicate: BinaryPredicate<ClosureTableOffsprings<K>, K>): Nullable<ClosureTableOffsprings<K>> {
    return this.table.find(predicate);
  }

  public map<W extends Nominative>(mapper: Mapper<ClosureTableOffsprings<K>, W>): ImmutableProject<K, W> {
    return this.table.map<W>(mapper);
  }

  public sort(): ReadonlySequence<K> {
    const pairs: Array<Pair<K, ClosureTableOffsprings<K>>> = [...this.table];

    const keys: Array<K> = pairs.sort((p1: Pair<K, ClosureTableOffsprings<K>>, p2: Pair<K, ClosureTableOffsprings<K>>) => {
      return p1.getValue().compare(p2.getValue());
    }).map<K>((pair: Pair<K, ClosureTableOffsprings<K>>) => {
      return pair.getKey();
    });

    return ImmutableSequence.ofArray<K>(keys);
  }
}
