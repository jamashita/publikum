import { ImmutableAddress, MutableAddress } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { ClosureTableOffsprings } from '../ClosureTableOffsprings';

export class MockClosureTableOffsprings<K extends Nominative> extends ClosureTableOffsprings<K> {
  private static toAddress<KT extends Nominative>(offsprings: ReadonlyArray<KT>): ImmutableAddress<KT> {
    const address: MutableAddress<KT> = MutableAddress.empty<KT>();

    offsprings.forEach((offspring: KT) => {
      address.add(offspring);
    });

    return ImmutableAddress.of<KT>(address);
  }

  public constructor(...offsprings: ReadonlyArray<K>) {
    super(MockClosureTableOffsprings.toAddress<K>(offsprings));
  }
}
