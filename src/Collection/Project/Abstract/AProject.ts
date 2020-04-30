import { Project } from '..';
import { Nominative } from '../../../Interface';
import { Objet } from '../../../Object';
import { Absent, Present, Quantum } from '../../../Quantum';
import { Ambiguous, BiPredicate, Enumerator } from '../../../Type';

export abstract class AProject<K extends Nominative, V extends Nominative> extends Objet implements Project<K, V> {
  public abstract readonly noun: string;
  protected readonly elements: Map<string, [K, V]>;

  protected constructor(elements: Map<string, [K, V]>) {
    super();
    this.elements = elements;
  }

  public abstract set(key: K, value: V): Project<K, V>;

  public abstract remove(key: K): Project<K, V>;

  public abstract duplicate(): Project<K, V>;

  public get(key: K): Quantum<V> {
    const element: Ambiguous<[K, V]> = this.elements.get(key.hashCode());

    if (element === undefined) {
      return Absent.of<V>();
    }

    return Present.of<V>(element[1]);
  }

  public has(key: K): boolean {
    return this.elements.has(key.hashCode());
  }

  public contains(value: V): boolean {
    for (const [, [, v]] of this.elements) {
      if (value.equals(v)) {
        return true;
      }
    }

    return false;
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

  public forEach(iteration: Enumerator<K, V>): void {
    this.elements.forEach((element: [K, V]) => {
      iteration(element[1], element[0]);
    });
  }

  public every(predicate: BiPredicate<K, V>): boolean {
    for (const [, [k, v]] of this.elements) {
      if (!predicate(k, v)) {
        return false;
      }
    }

    return true;
  }

  public some(predicate: BiPredicate<K, V>): boolean {
    for (const [, [k, v]] of this.elements) {
      if (predicate(k, v)) {
        return true;
      }
    }

    return false;
  }

  public equals(other: AProject<K, V>): boolean {
    if (this === other) {
      return true;
    }
    if (this.size() !== other.size()) {
      return false;
    }

    return this.every((key: K, value: V) => {
      const quantum: Quantum<V> = other.get(key);

      if (quantum.isPresent()) {
        if (value.equals(quantum.get())) {
          return true;
        }
      }

      return false;
    });
  }

  public toMap(): Map<K, V> {
    const map: Map<K, V> = new Map<K, V>();

    this.forEach((value: V, key: K) => {
      map.set(key, value);
    });

    return map;
  }

  public serialize(): string {
    const properties: Array<string> = [];

    this.forEach((value: V, key: K) => {
      properties.push(`{${key.toString()}: ${value.toString()}}`);
    });

    return properties.join(', ');
  }
}
