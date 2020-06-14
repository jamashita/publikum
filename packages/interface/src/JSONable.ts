import { ObjectLiteral } from '@jamashita/publikum-type';

export interface JSONable<O extends ObjectLiteral = ObjectLiteral> {
  toJSON(): O;
}
