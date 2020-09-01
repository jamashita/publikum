import { DestroyPlan } from '../../Plan/Interface/DestroyPlan';
import { ThrowChrono } from '../Chrono/Interface/ThrowChrono';

export class DestroyChronoPlan implements DestroyPlan<'DestroyChronoPlan'> {
  public readonly noun: 'DestroyChronoPlan' = 'DestroyChronoPlan';
  private readonly chrono: ThrowChrono;

  public static of(chrono: ThrowChrono): DestroyChronoPlan {
    return new DestroyChronoPlan(chrono);
  }

  protected constructor(chrono: ThrowChrono) {
    this.chrono = chrono;
  }

  public onDestroy(cause: unknown): unknown {
    return this.chrono.throw(cause);
  }
}
