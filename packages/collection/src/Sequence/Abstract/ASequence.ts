import { Nominative } from '@jamashita/publikum-interface';
import {
  Ambiguous,
  BinaryPredicate,
  CancellableEnumerator,
  Enumerator,
  Mapper,
  Nullable,
  Peek,
  Predicate
} from '@jamashita/publikum-type';

import { Pair } from '../../Pair';
import { Quantity } from '../../Quantity';
import { Sequence } from '../Interface/Sequence';

// TODO TESTS UNDONE
export abstract class ASequence<E extends Nominative<E>, N extends string = string>
  extends Quantity<ASequence<E, N>, number, E, N>
  implements Sequence<E, N> {
  public abstract readonly noun: N;
  protected readonly elements: Array<E>;

  protected constructor(elements: Array<E>) {
    super();
    this.elements = elements;
  }

  public abstract add(...elements: Array<E>): Sequence<E, N>;

  public abstract map<F extends Nominative<F>>(mapper: Mapper<E, F>): Sequence<F, N>;

  public abstract filter(iterator: Enumerator<number, E>): Sequence<E, N>;

  public abstract duplicate(): Sequence<E, N>;

  public get(index: number): Nullable<E> {
    const element: Ambiguous<E> = this.elements[index];

    if (element === undefined) {
      return null;
    }

    return element;
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

  public iterator(): Iterator<Pair<number, E>> {
    return this.elements
      .map<Pair<number, E>>((e: E, index: number) => {
        return Pair.of(index, e);
      })
      [Symbol.iterator]();
  }

  public forEach(iteration: CancellableEnumerator<number, E>): void {
    let done: boolean = false;
    const cancel: Peek = () => {
      done = true;
    };

    for (let i: number = 0; i < this.elements.length; i++) {
      iteration(this.elements[i], i, cancel);

      if (done) {
        return;
      }
    }
  }

  public find(predicate: Predicate<E>): Nullable<E> {
    const element: Ambiguous<E> = this.elements.find(predicate);

    if (element === undefined) {
      return null;
    }

    return element;
  }

  public every(predicate: BinaryPredicate<E, number>): boolean {
    return this.elements.every(predicate);
  }

  public some(predicate: BinaryPredicate<E, number>): boolean {
    return this.elements.some(predicate);
  }

  public equals(other: Sequence<E, N>): boolean {
    if (this === other) {
      return true;
    }
    if (this.size() !== other.size()) {
      return false;
    }

    const thisIterator: Iterator<Pair<number, E>> = this.iterator();
    const otherIterator: Iterator<Pair<number, E>> = other.iterator();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const thisRes: IteratorResult<Pair<number, E>> = thisIterator.next();
      const otherRes: IteratorResult<Pair<number, E>> = otherIterator.next();

      if (thisRes.done !== true && otherRes.done !== true) {
        if (!thisRes.value.getValue().equals(otherRes.value.getValue())) {
          return false;
        }

        continue;
      }
      if (thisRes.done === true && otherRes.done === true) {
        return true;
      }

      return false;
    }
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
