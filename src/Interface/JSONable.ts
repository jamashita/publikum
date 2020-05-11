import { JSObjectNotation } from '../Type';

export interface JSONable {
  toJSON(): JSObjectNotation;
}
