import { Epoque } from '@jamashita/publikum-monad';
import { Plan } from '../../Plan/Interface/Plan';

export class PassThroughEpoquePlan implements Plan<void, void, 'PassThroughEpoquePlan'> {
  public readonly noun: 'PassThroughEpoquePlan' = 'PassThroughEpoquePlan';
  private readonly epoque: Epoque<void>;

  public static of(epoque: Epoque<void>): PassThroughEpoquePlan {
    return new PassThroughEpoquePlan(epoque);
  }

  protected constructor(epoque: Epoque<void>) {
    this.epoque = epoque;
  }

  public onMap(): unknown {
    return this.epoque.accept();
  }

  public onRecover(): unknown {
    return this.epoque.decline();
  }

  public onDestroy(cause: unknown): unknown {
    return this.epoque.throw(cause);
  }
}
