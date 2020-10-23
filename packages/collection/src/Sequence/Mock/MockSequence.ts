import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';
import { ASequence } from '../Abstract/ASequence';

export class MockSequence<V extends Nominative> extends ASequence<V, 'MockSequence'> {
  public readonly noun: 'MockSequence' = 'MockSequence';

  public constructor(elements: ReadonlyArray<V>) {
    super(elements);
  }

  public add(): MockSequence<V> {
    throw new UnimplementedError();
  }

  public set(): MockSequence<V> {
    throw new UnimplementedError();
  }

  public remove(): MockSequence<V> {
    throw new UnimplementedError();
  }

  public map<W extends Nominative>(): MockSequence<W> {
    throw new UnimplementedError();
  }

  public filter(): MockSequence<V> {
    throw new UnimplementedError();
  }

  public duplicate(): MockSequence<V> {
    throw new UnimplementedError();
  }
}
