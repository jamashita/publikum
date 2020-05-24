import { UnimplementedError } from '@publikum/error';
import { Nominative } from '@publikum/interface';

import { AAddress } from '../Abstract/AAddress';
import { Address } from '../Interface/Address';

export class MockAAddress<E extends Nominative> extends AAddress<E> implements Address<E> {
  public readonly noun: 'MockAAddress' = 'MockAAddress';

  private static constructMap<E extends Nominative>(elements: Set<E>): Map<string, E> {
    const map: Map<string, E> = new Map<string, E>();

    elements.forEach((e: E) => {
      map.set(e.hashCode(), e);
    });

    return map;
  }

  public constructor(elements: Set<E>) {
    super(MockAAddress.constructMap<E>(elements));
  }

  public add(): Address<E> {
    throw new UnimplementedError();
  }

  public remove(): Address<E> {
    throw new UnimplementedError();
  }

  public duplicate(): Address<E> {
    throw new UnimplementedError();
  }
}
