import { Noun } from '@jamashita/publikum-interface';

export interface DisasterPlan<N extends string = string> extends Noun<N> {
  onDisaster(error: unknown): unknown;
}
