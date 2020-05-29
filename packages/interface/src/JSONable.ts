import { ObjectLiteral } from '@jamashita/publikum/type';

export interface JSONable {
  toJSON(): ObjectLiteral;
}
