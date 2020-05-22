import { ASequence, Sequence } from '../';
import { UnimplementedError } from '../../../Error/UnimplementedError';
import { Nominative } from '../../../Interface';
import { ImmutableSequence } from '../ImmutableSequence';

export class MockASequence<E extends Nominative> extends ASequence<E> implements Sequence<E> {
  public readonly noun: 'MockASequence' = 'MockASequence';

  public constructor(elements: Array<E>) {
    super(elements);
  }

  public add(): Sequence<E> {
    throw new UnimplementedError();
  }

  public map<F extends Nominative>(): Sequence<F> {
    throw new UnimplementedError();
  }

  public filter(): ImmutableSequence<E> {
    throw new UnimplementedError();
  }

  public duplicate(): Sequence<E> {
    throw new UnimplementedError();
  }
}
