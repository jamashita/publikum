import { RejectEpoque } from '../Epoque/Interface/RejectEpoque';
import { IRejectHandler } from './Interface/IRejectHandler';

export class RejectPeekHandler implements IRejectHandler<void, 'RejectPeekHandler'> {
  public readonly noun: 'RejectPeekHandler' = 'RejectPeekHandler';
  private readonly epoque: RejectEpoque<void>;

  public static of(epoque: RejectEpoque<void>): RejectPeekHandler {
    return new RejectPeekHandler(epoque);
  }

  protected constructor(epoque: RejectEpoque<void>) {
    this.epoque = epoque;
  }

  public onReject(): unknown {
    return this.epoque.reject();
  }
}
