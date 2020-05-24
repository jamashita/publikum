import { Nominative } from '@publikum/interface';
import { Absent, Present, Quantum } from '@publikum/monad';
import { Objet } from '@publikum/object';
import { Ambiguous, Enumerator, Predicate } from '@publikum/type';

import { Address } from '../Interface/Address';

export abstract class AAddress<E extends Nominative> extends Objet implements Address<E> {
  public abstract readonly noun: string;
  protected readonly elements: Map<string, E>;

  protected constructor(elements: Map<string, E>) {
    super();
    this.elements = elements;
  }

  public abstract add(...elements: Array<E>): Address<E>;

  public abstract remove(element: E): Address<E>;

  public abstract duplicate(): Address<E>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public get(key: void): Quantum<E> {
    return Absent.of<E>();
  }

  public contains(value: E): boolean {
    return this.elements.has(value.hashCode());
  }

  public size(): number {
    return this.elements.size;
  }

  public isEmpty(): boolean {
    if (this.size() === 0) {
      return true;
    }

    return false;
  }

  public forEach(iteration: Enumerator<void, E>): void {
    this.elements.forEach((element: E) => {
      iteration(element);
    });
  }

  public find(predicate: Predicate<E>): Quantum<E> {
    const element: Ambiguous<E> = this.traverse(predicate);

    if (element === undefined) {
      return Absent.of<E>();
    }

    return Present.of<E>(element);
  }

  private traverse(predicate: Predicate<E>): Ambiguous<E> {
    for (const [, element] of this.elements) {
      if (predicate(element)) {
        return element;
      }
    }

    return undefined;
  }

  public every(predicate: Predicate<E>): boolean {
    for (const [, element] of this.elements) {
      if (!predicate(element)) {
        return false;
      }
    }

    return true;
  }

  public some(predicate: Predicate<E>): boolean {
    for (const [, element] of this.elements) {
      if (predicate(element)) {
        return true;
      }
    }

    return false;
  }

  public equals(other: AAddress<E>): boolean {
    if (this === other) {
      return true;
    }
    if (this.size() !== other.size()) {
      return false;
    }

    return this.every((element: E) => {
      return other.contains(element);
    });
  }

  public toSet(): Set<E> {
    return new Set<E>(this.elements.values());
  }

  public serialize(): string {
    const properties: Array<string> = [];

    this.forEach((element: E) => {
      properties.push(element.toString());
    });

    return properties.join(', ');
  }
}
