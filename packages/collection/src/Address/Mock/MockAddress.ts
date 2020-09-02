import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';
import { AAddress } from '../Abstract/AAddress';

export class MockAddress<E extends Nominative<E>> extends AAddress<E, 'MockAddress'> {
  public readonly noun: 'MockAddress' = 'MockAddress';

  private static constructMap<ET extends Nominative<ET>>(elements: Set<ET>): Map<string, ET> {
    const map: Map<string, ET> = new Map<string, ET>();

    elements.forEach((e: ET) => {
      map.set(e.hashCode(), e);
    });

    return map;
  }

  public constructor(elements: Set<E>) {
    super(MockAddress.constructMap<E>(elements));
  }

  public add(): MockAddress<E> {
    throw new UnimplementedError();
  }

  public remove(): MockAddress<E> {
    throw new UnimplementedError();
  }

  public duplicate(): MockAddress<E> {
    throw new UnimplementedError();
  }
}
