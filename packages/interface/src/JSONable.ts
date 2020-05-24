import { JSObjectNotation } from '@publikum/type';

export interface JSONable {
  toJSON(): JSObjectNotation;
}
