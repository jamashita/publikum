import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';
import { DeclineChrono } from '../Chrono/Interface/DeclineChrono';

export class RecoveryChronoPlan<R> implements RecoveryPlan<R, 'RecoveryPeekPlan'> {
  public readonly noun: 'RecoveryPeekPlan' = 'RecoveryPeekPlan';
  private readonly chrono: DeclineChrono<R>;

  public static of<R>(chrono: DeclineChrono<R>): RecoveryChronoPlan<R> {
    return new RecoveryChronoPlan<R>(chrono);
  }

  protected constructor(chrono: DeclineChrono<R>) {
    this.chrono = chrono;
  }

  public onRecover(value: R): unknown {
    return this.chrono.decline(value);
  }
}
