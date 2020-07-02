import { ResolveEpoque } from '../Epoque/Interface/ResolveEpoque';
import { MappingPlan } from './Interface/MappingPlan';

export class MappingConsumerPlan<R> implements MappingPlan<R, 'MappingConsumerPlan'> {
  public readonly noun: 'MappingConsumerPlan' = 'MappingConsumerPlan';
  private readonly epoque: ResolveEpoque<R>;

  public static of<R>(epoque: ResolveEpoque<R>): MappingConsumerPlan<R> {
    return new MappingConsumerPlan<R>(epoque);
  }

  protected constructor(epoque: ResolveEpoque<R>) {
    this.epoque = epoque;
  }

  public onResolve(resolve: R): unknown {
    return this.epoque.resolve(resolve);
  }
}
