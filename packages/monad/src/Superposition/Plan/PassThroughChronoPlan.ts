import { Plan } from '../../Plan/Interface/Plan';
import { Chrono } from '../Chrono/Interface/Chrono';

export class PassThroughChronoPlan implements Plan<void, void, 'PassThroughChronoPlan'> {
  public readonly noun: 'PassThroughChronoPlan' = 'PassThroughChronoPlan';
  private readonly chrono: Chrono<void, void>;

  public static of(chrono: Chrono<void, void>): PassThroughChronoPlan {
    return new PassThroughChronoPlan(chrono);
  }

  protected constructor(chrono: Chrono<void, void>) {
    this.chrono = chrono;
  }

  public onMap(): unknown {
    return this.chrono.accept();
  }

  public onRecover(): unknown {
    return this.chrono.decline();
  }

  public onDestroy(cause: unknown): unknown {
    return this.chrono.throw(cause);
  }
}
