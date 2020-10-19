import { UnimplementedError } from '@jamashita/publikum-error';
import { ValueObject } from '@jamashita/publikum-object';
import { SerializableTreeObject, StructurableTreeObject, TreeID } from '@jamashita/publikum-tree';
import { ObjectLiteral } from '@jamashita/publikum-type';

export class MockTreeObject<K extends TreeID> extends ValueObject<'MockTreeObject'> implements StructurableTreeObject<K, 'MockTreeObject'>, SerializableTreeObject<'MockTreeObject'> {
  public readonly noun: 'MockTreeObject' = 'MockTreeObject';

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof MockTreeObject)) {
      return false;
    }

    return true;
  }

  public serialize(): string {
    throw new UnimplementedError();
  }

  public getTreeID(): K {
    throw new UnimplementedError();
  }

  public toJSON(): ObjectLiteral {
    throw new UnimplementedError();
  }
}
