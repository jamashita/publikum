import { ThrowEpoque } from '../Epoque/Interface/ThrowEpoque';
import { DisasterPlan } from './Interface/DisasterPlan';

// TODO
export class DisasterConsumerPlan implements DisasterPlan<'DisasterConsumerPlan'> {
  public readonly noun: 'DisasterConsumerPlan' = 'DisasterConsumerPlan';
  private readonly epoque: ThrowEpoque;

  public static of(epoque: ThrowEpoque): DisasterConsumerPlan {
    return new DisasterConsumerPlan(epoque);
  }

  protected constructor(epoque: ThrowEpoque) {
    this.epoque = epoque;
  }

  public onDisaster(error: unknown): unknown {
    return this.epoque.throw(error);
  }
}
