import { ASequence, Sequence } from '..';
import { Nominative } from '../../../Interface';
import { Enumerator, Mapper } from '../../../Type';
import { UnimplementedError } from '../../../Error/UnimplementedError';
import { ImmutableSequence } from '../ImmutableSequence';

export class MockASequence<E extends Nominative> extends ASequence<E> implements Sequence<E> {
  public readonly noun: 'MockASequence' = 'MockASequence';

  public constructor(elements: Array<E>) {
    super(elements);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public add(...elements: Array<E>): Sequence<E> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<F extends Nominative>(mapper: Mapper<E, F>): Sequence<F> {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(iterator: Enumerator<number, E>): ImmutableSequence<E> {
    throw new UnimplementedError();
  }

  public duplicate(): Sequence<E> {
    throw new UnimplementedError();
  }
}
