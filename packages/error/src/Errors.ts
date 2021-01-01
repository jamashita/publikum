import { Ambiguous, Kind } from '@jamashita/publikum-type';
import { RuntimeError } from './RuntimeError';

export class Errors<E extends Error> extends RuntimeError<'Errors'> implements Iterable<E> {
  public readonly noun: 'Errors' = 'Errors';
  private readonly errors: Array<E>;

  private static getMessage(errors: Array<Error>): string {
    return errors.map<string>((error: Error) => {
      return error.message;
    }).join('\n');
  }

  public constructor(errors: Array<E>) {
    super(Errors.getMessage(errors));
    this.errors = errors;
  }

  public [Symbol.iterator](): Iterator<E> {
    return this.errors[Symbol.iterator]();
  }

  public getStack(): string {
    return this.errors.map<Ambiguous<string>>((error: E) => {
      if (error instanceof RuntimeError) {
        return error.getStack();
      }

      return error.stack;
    }).filter((stack: Ambiguous<string>): stack is string => {
      return !Kind.isUndefined(stack);
    }).join('\n');
  }
}
