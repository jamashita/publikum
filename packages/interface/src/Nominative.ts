import { Equalable } from './Equalable';
import { Noun } from './Noun';
import { Serializable } from './Serializable';

export interface Nominative<T extends Nominative<T>> extends Equalable<T>, Serializable, Noun {
  hashCode(): string;
}
