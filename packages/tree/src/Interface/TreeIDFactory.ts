import { Primitive } from '@jamashita/publikum-type';
import { TreeID } from './TreeID';

export interface TreeIDFactory<K extends TreeID> {
  forge(id: Primitive): K;
}
