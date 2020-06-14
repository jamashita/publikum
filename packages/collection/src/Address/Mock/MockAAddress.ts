import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';

import { AAddress } from '../Abstract/AAddress';

export class MockAAddress<E extends Nominative<E>> extends AAddress<E, 'MockAAddress'> {
  public readonly noun: 'MockAAddress' = 'MockAAddress';

  private static constructMap<E extends Nominative<E>>(elements: Set<E>): Map<string, E> {
    const map: Map<string, E> = new Map<string, E>();

    elements.forEach((e: E) => {
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
