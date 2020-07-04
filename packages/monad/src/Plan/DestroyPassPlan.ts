import { ThrowEpoque } from '../Epoque/Interface/ThrowEpoque';
import { DestroyPlan } from './Interface/DestroyPlan';

export class DestroyPassPlan implements DestroyPlan<'DestroyPassPlan'> {
  public readonly noun: 'DestroyPassPlan' = 'DestroyPassPlan';
  private readonly epoque: ThrowEpoque;

  public static of(epoque: ThrowEpoque): DestroyPassPlan {
    return new DestroyPassPlan(epoque);
  }

  protected constructor(epoque: ThrowEpoque) {
    this.epoque = epoque;
  }

  public onDestroy(cause: unknown): unknown {
    return this.epoque.throw(cause);
  }
}
