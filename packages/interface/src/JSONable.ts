import { ObjectLiteral } from '@publikum/type';

export interface JSONable {
  toJSON(): ObjectLiteral;
}
