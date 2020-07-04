import { Noun } from '@jamashita/publikum-interface';

export interface ThrowEpoque<N extends string = string> extends Noun<N> {
  throw(cause: unknown): unknown;
}
