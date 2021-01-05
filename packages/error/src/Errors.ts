import { Ambiguous, Kind } from '@jamashita/publikum-type';
import { RuntimeError } from './RuntimeError';

export class Errors<E extends Error> extends RuntimeError<'Errors'> implements Iterable<E> {
  public readonly noun: 'Errors' = 'Errors';
  private readonly errors: ReadonlyArray<E>;

  public static of<ET extends Error>(errors: Iterable<ET>): Errors<ET> {
    return new Errors<ET>([...errors]);
  }

  public static ofSpread<ET extends Error>(...errors: ReadonlyArray<ET>): Errors<ET> {
    return Errors.of<ET>(errors);
  }

  private static getMessage<ET extends Error>(errors: ReadonlyArray<ET>): string {
    return errors.map<string>((error: Error) => {
      return error.message;
    }).join('\n');
  }

  public constructor(errors: ReadonlyArray<E>) {
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

  public getErrors(): Array<E> {
    return [...this.errors];
  }
}
