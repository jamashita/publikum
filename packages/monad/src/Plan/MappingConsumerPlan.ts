import { AcceptEpoque } from '../Epoque/Interface/AcceptEpoque';
import { MappingPlan } from './Interface/MappingPlan';

export class MappingConsumerPlan<M> implements MappingPlan<M, 'MappingConsumerPlan'> {
  public readonly noun: 'MappingConsumerPlan' = 'MappingConsumerPlan';
  private readonly epoque: AcceptEpoque<M>;

  public static of<R>(epoque: AcceptEpoque<R>): MappingConsumerPlan<R> {
    return new MappingConsumerPlan<R>(epoque);
  }

  protected constructor(epoque: AcceptEpoque<M>) {
    this.epoque = epoque;
  }

  public onMap(value: M): unknown {
    return this.epoque.accept(value);
  }
}
