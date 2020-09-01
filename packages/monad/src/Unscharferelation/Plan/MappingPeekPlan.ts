import { MappingPlan } from '../../Plan/Interface/MappingPlan';
import { AcceptEpoque } from '../Epoque/Interface/AcceptEpoque';

export class MappingPeekPlan implements MappingPlan<void, 'MappingPeekPlan'> {
  public readonly noun: 'MappingPeekPlan' = 'MappingPeekPlan';
  private readonly epoque: AcceptEpoque<void>;

  public static of(epoque: AcceptEpoque<void>): MappingPeekPlan {
    return new MappingPeekPlan(epoque);
  }

  protected constructor(epoque: AcceptEpoque<void>) {
    this.epoque = epoque;
  }

  public onMap(): unknown {
    return this.epoque.accept();
  }
}
