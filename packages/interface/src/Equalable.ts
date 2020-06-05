export interface Equalable<T extends Equalable<T>> {
  equals(other: T): boolean;
}
