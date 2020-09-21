import { Kind } from '@jamashita/publikum-type';
import { Objet } from './Objet';

export abstract class ValueObject<N extends string = string> extends Objet<N> {
  public abstract readonly noun: N;
  private code?: string;

  public abstract serialize(): string;

  public hashCode(): string {
    if (!Kind.isUndefined(this.code)) {
      return this.code;
    }

    this.code = super.hashCode();

    return this.code;
  }
}
