import { MappingPlan } from '../../Plan/Interface/MappingPlan';
import { AcceptChrono } from '../Chrono/Interface/AcceptChrono';

export class MappingChronoPlan<M> implements MappingPlan<M, 'MappingChronoPlan'> {
  public readonly noun: 'MappingChronoPlan' = 'MappingChronoPlan';
  private readonly chrono: AcceptChrono<M>;

  public static of<M>(chrono: AcceptChrono<M>): MappingChronoPlan<M> {
    return new MappingChronoPlan<M>(chrono);
  }

  protected constructor(chrono: AcceptChrono<M>) {
    this.chrono = chrono;
  }

  public onMap(value: M): unknown {
    return this.chrono.accept(value);
  }
}
