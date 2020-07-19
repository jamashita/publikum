import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';

import { ASequence } from '../Abstract/ASequence';

export class MockASequence<E extends Nominative<E>> extends ASequence<E, 'MockASequence'> {
  public readonly noun: 'MockASequence' = 'MockASequence';

  public constructor(elements: Array<E>) {
    super(elements);
  }

  public add(): MockASequence<E> {
    throw new UnimplementedError();
  }

  public remove(): MockASequence<E> {
    throw new UnimplementedError();
  }

  public set(): MockASequence<E> {
    throw new UnimplementedError();
  }

  public map<F extends Nominative<F>>(): MockASequence<F> {
    throw new UnimplementedError();
  }

  public filter(): MockASequence<E> {
    throw new UnimplementedError();
  }

  public duplicate(): MockASequence<E> {
    throw new UnimplementedError();
  }
}
