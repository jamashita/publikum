import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';
import { AAddress } from '../Abstract/AAddress';

// TODO RENAME TO MockAddress
export class MockAAddress<E extends Nominative<E>> extends AAddress<E, 'MockAAddress'> {
  public readonly noun: 'MockAAddress' = 'MockAAddress';

  private static constructMap<ET extends Nominative<ET>>(elements: Set<ET>): Map<string, ET> {
    const map: Map<string, ET> = new Map<string, ET>();

    elements.forEach((e: ET) => {
      map.set(e.hashCode(), e);
    });

    return map;
  }

  public constructor(elements: Set<E>) {
    super(MockAAddress.constructMap<E>(elements));
  }

  public add(): MockAAddress<E> {
    throw new UnimplementedError();
  }

  public remove(): MockAAddress<E> {
    throw new UnimplementedError();
  }

  public duplicate(): MockAAddress<E> {
    throw new UnimplementedError();
  }
}
