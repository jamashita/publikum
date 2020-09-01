import { MappingPlan } from '../../Plan/Interface/MappingPlan';
import { AcceptEpoque } from '../Epoque/Interface/AcceptEpoque';

export class MappingEpoquePlan<M> implements MappingPlan<M, 'MappingEpoquePlan'> {
  public readonly noun: 'MappingEpoquePlan' = 'MappingEpoquePlan';
  private readonly epoque: AcceptEpoque<M>;

  public static of<MT>(epoque: AcceptEpoque<MT>): MappingEpoquePlan<MT> {
    return new MappingEpoquePlan<MT>(epoque);
  }

  protected constructor(epoque: AcceptEpoque<M>) {
    this.epoque = epoque;
  }

  public onMap(value: M): unknown {
    return this.epoque.accept(value);
  }
}
