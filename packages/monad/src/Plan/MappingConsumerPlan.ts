import { AcceptEpoque } from '../Epoque/Interface/AcceptEpoque';
import { MappingPlan } from './Interface/MappingPlan';

export class MappingConsumerPlan<R> implements MappingPlan<R, 'MappingConsumerPlan'> {
  public readonly noun: 'MappingConsumerPlan' = 'MappingConsumerPlan';
  private readonly epoque: AcceptEpoque<R>;

  public static of<R>(epoque: AcceptEpoque<R>): MappingConsumerPlan<R> {
    return new MappingConsumerPlan<R>(epoque);
  }

  protected constructor(epoque: AcceptEpoque<R>) {
    this.epoque = epoque;
  }

  public onMap(resolve: R): unknown {
    return this.epoque.accept(resolve);
  }
}
