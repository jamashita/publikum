import { ImmutableSequence } from '@jamashita/publikum-collection';
import { TreeID } from '../../Interface/TreeID';
import { ClosureTableHierarchies } from '../ClosureTableHierarchies';
import { ClosureTableHierarchy } from '../ClosureTableHierarchy';

export class MockClosureTableHierarchies<K extends TreeID> extends ClosureTableHierarchies<K> {
  public constructor(...hierarchies: ReadonlyArray<ClosureTableHierarchy<K>>) {
    super(ImmutableSequence.ofArray<ClosureTableHierarchy<K>>(hierarchies));
  }
}
