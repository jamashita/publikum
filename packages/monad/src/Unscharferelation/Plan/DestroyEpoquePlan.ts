import { DestroyPlan } from '../../Plan/Interface/DestroyPlan';
import { ThrowEpoque } from '../Epoque/Interface/ThrowEpoque';

export class DestroyEpoquePlan implements DestroyPlan<'DestroyEpoquePlan'> {
  public readonly noun: 'DestroyEpoquePlan' = 'DestroyEpoquePlan';
  private readonly epoque: ThrowEpoque;

  public static of(epoque: ThrowEpoque): DestroyEpoquePlan {
    return new DestroyEpoquePlan(epoque);
  }

  protected constructor(epoque: ThrowEpoque) {
    this.epoque = epoque;
  }

  public onDestroy(cause: unknown): unknown {
    return this.epoque.throw(cause);
  }
}
