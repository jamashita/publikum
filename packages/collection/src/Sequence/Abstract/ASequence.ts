import { Nominative } from '@jamashita/publikum-interface';
import { Absent, Present, Quantum } from '@jamashita/publikum-monad';
import {
    Ambiguous, BinaryPredicate, Enumerator, Mapper, Predicate
} from '@jamashita/publikum-type';

import { Quantity } from '../../Quantity';
import { Sequence } from '../Interface/Sequence';

export abstract class ASequence<E extends Nominative<E>, N extends string = string> extends Quantity<number, E, N>
  implements Sequence<E, N> {
  public abstract readonly noun: N;
  protected readonly elements: Array<E>;

  protected constructor(elements: Array<E>) {
    super();
    this.elements = elements;
  }

  public abstract add(...elements: Array<E>): Sequence<E, N>;

  public abstract map<F extends Nominative<F, N>>(mapper: Mapper<E, F>): Sequence<F, N>;

  public abstract filter(iterator: Enumerator<number, E>): Sequence<E, N>;

  public abstract duplicate(): Sequence<E, N>;

  public get(index: number): Quantum<E> {
    const element: Ambiguous<E> = this.elements[index];

    if (element === undefined) {
      return Absent.of<E>();
    }

    return Present.of<E>(element);
  }

  public contains(value: E): boolean {
    const found: Ambiguous<E> = this.elements.find((element: E) => {
      return value.equals(element);
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.elements.length;
  }

  public isEmpty(): boolean {
    if (this.size() === 0) {
      return true;
    }

    return false;
  }

  public forEach(iteration: Mapper<E, void>): void {
    this.elements.forEach(iteration);
  }

  public find(predicate: Predicate<E>): Quantum<E> {
    const element: Ambiguous<E> = this.elements.find(predicate);

    if (element === undefined) {
      return Absent.of<E>();
    }

    return Present.of<E>(element);
  }

  public every(predicate: BinaryPredicate<E, number>): boolean {
    return this.elements.every(predicate);
  }

  public some(predicate: BinaryPredicate<E, number>): boolean {
    return this.elements.some(predicate);
  }

  public equals(other: ASequence<E, N>): boolean {
    if (this === other) {
      return true;
    }
    if (this.size() !== other.size()) {
      return false;
    }

    return this.elements.every((element: E, index: number) => {
      return element.equals(other.elements[index]);
    });
  }

  public toArray(): Array<E> {
    return [...this.elements];
  }

  public serialize(): string {
    return this.elements
      .map<string>((element: E) => {
        return element.toString();
      })
      .join(', ');
  }
}
