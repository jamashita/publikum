import { AcceptEpoque } from '../Epoque/Interface/AcceptEpoque';
import { MappingPlan } from './Interface/MappingPlan';

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
