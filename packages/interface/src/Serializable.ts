import { Kind } from '@jamashita/publikum-type';

export interface Serializable {
  serialize(): string;

  toString(): string;
}

export const isSerializable = (n: unknown): n is Serializable => {
  if (!Kind.isObject<Serializable>(n)) {
    return false;
  }
  if (typeof n.serialize !== 'function') {
    return false;
  }

  return true;
};
