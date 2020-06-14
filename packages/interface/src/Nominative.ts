import { Equalable } from './Equalable';
import { Noun } from './Noun';
import { Serializable } from './Serializable';

export interface Nominative<T extends Nominative<T>, N extends string = string>
  extends Equalable<T>,
    Serializable,
    Noun<N> {
  hashCode(): string;
}
