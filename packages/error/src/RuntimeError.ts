import { Noun } from '@jamashita/publikum-interface';
import { BaseError, fullStack } from 'make-error-cause';

export abstract class RuntimeError<N extends string = string> extends BaseError implements Noun<N> {
  public abstract readonly noun: N;

  protected constructor(message: string, cause?: Error) {
    super(message, cause);
  }

  public getStack(): string {
    return fullStack(this);
  }
}
