import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';
import { ASequence } from '../Abstract/ASequence';

export class MockSequence<E extends Nominative<E>> extends ASequence<E, 'MockSequence'> {
  public readonly noun: 'MockSequence' = 'MockSequence';

  public constructor(elements: Array<E>) {
    super(elements);
  }

  public add(): MockSequence<E> {
    throw new UnimplementedError();
  }

  public remove(): MockSequence<E> {
    throw new UnimplementedError();
  }

  public set(): MockSequence<E> {
    throw new UnimplementedError();
  }

  public map<F extends Nominative<F>>(): MockSequence<F> {
    throw new UnimplementedError();
  }

  public filter(): MockSequence<E> {
    throw new UnimplementedError();
  }

  public duplicate(): MockSequence<E> {
    throw new UnimplementedError();
  }
}
