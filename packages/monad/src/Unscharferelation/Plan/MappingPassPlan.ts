import { MappingPlan } from '../../Plan/Interface/MappingPlan';
import { AcceptEpoque } from '../Epoque/Interface/AcceptEpoque';

export class MappingPassPlan<M> implements MappingPlan<M, 'MappingPassPlan'> {
  public readonly noun: 'MappingPassPlan' = 'MappingPassPlan';
  private readonly epoque: AcceptEpoque<M>;

  public static of<M>(epoque: AcceptEpoque<M>): MappingPassPlan<M> {
    return new MappingPassPlan<M>(epoque);
  }

  protected constructor(epoque: AcceptEpoque<M>) {
    this.epoque = epoque;
  }

  public onMap(value: M): unknown {
    return this.epoque.accept(value);
  }
}
