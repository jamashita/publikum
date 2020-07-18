import { RuntimeError } from './RuntimeError';

export class DataSourceError<N extends string = string, S extends string = string> extends RuntimeError<N> {
  public readonly noun: N;
  public readonly source: S;

  public constructor(noun: N, source: S, message: string, cause?: Error) {
    super(message, cause);
    this.noun = noun;
    this.source = source;
  }
}
