import { Noun } from '@jamashita/publikum-interface';

export interface DeclineEpoque<N extends string = string> extends Noun<N> {
  decline(): unknown | void;
}
