import { RuntimeError } from './RuntimeError';

export abstract class DataSourceError<N extends string = string, S extends string = string> extends RuntimeError<N> {
  public abstract readonly noun: N;
  public abstract readonly source: S;

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
