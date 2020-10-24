import { MockTreeID } from '@jamashita/publikum-tree';
import { TreeIDFactory } from '../Interface/TreeIDFactory';

export class MockTreeIDFactory implements TreeIDFactory<MockTreeID> {
  public forge(id: string): MockTreeID {
    return new MockTreeID(id);
  }
}
