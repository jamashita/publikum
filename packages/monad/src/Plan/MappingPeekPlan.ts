import { ResolveEpoque } from '../Epoque/Interface/ResolveEpoque';
import { MappingPlan } from './Interface/MappingPlan';

export class MappingPeekPlan implements MappingPlan<void, 'MappingPeekPlan'> {
  public readonly noun: 'MappingPeekPlan' = 'MappingPeekPlan';
  private readonly epoque: ResolveEpoque<void>;

  public static of(epoque: ResolveEpoque<void>): MappingPeekPlan {
    return new MappingPeekPlan(epoque);
  }

  protected constructor(epoque: ResolveEpoque<void>) {
    this.epoque = epoque;
  }

  public onResolve(): unknown {
    return this.epoque.resolve();
  }
}
