import { MappingPlan } from '../../Plan/Interface/MappingPlan';
import { AcceptEpoque } from '../Epoque/Interface/AcceptEpoque';

export class MappingPassPlan<M> implements MappingPlan<M, 'MappingPassPlan'> {
  public readonly noun: 'MappingPassPlan' = 'MappingPassPlan';
  private readonly epoque: AcceptEpoque<M>;

  public static of<R>(epoque: AcceptEpoque<R>): MappingPassPlan<R> {
    return new MappingPassPlan<R>(epoque);
  }

  protected constructor(epoque: AcceptEpoque<M>) {
    this.epoque = epoque;
  }

  public onMap(value: M): unknown {
    return this.epoque.accept(value);
  }
}
