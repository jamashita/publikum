import { ThrowEpoque } from '../Epoque/Interface/ThrowEpoque';
import { DestroyPlan } from './Interface/DestroyPlan';

// TODO
export class DestroyPassPlan implements DestroyPlan<'DestroyPassPlan'> {
  public readonly noun: 'DestroyPassPlan' = 'DestroyPassPlan';
  private readonly epoque: ThrowEpoque;

  public static of(epoque: ThrowEpoque): DestroyPassPlan {
    return new DestroyPassPlan(epoque);
  }

  protected constructor(epoque: ThrowEpoque) {
    this.epoque = epoque;
  }

  public onDestroy(error: unknown): unknown {
    return this.epoque.throw(error);
  }
}
