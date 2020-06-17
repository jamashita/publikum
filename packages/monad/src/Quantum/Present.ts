import {
    AsyncConsumer, Consumer, Predicate, Resolve, Suspicious, UnaryFunction
} from '@jamashita/publikum-type';

import { Alive } from '../Superposition/Alive';
import { Superposition } from '../Superposition/Superposition';
import { Absent } from './Absent';
import { QuantumError } from './Error/QuantumError';
import { Planck } from './Planck';
import { Quantum } from './Quantum';

export class Present<T> extends Quantum<T, 'Present'> {
  public readonly noun: 'Present' = 'Present';
  private readonly value: T;

  public static of<T>(value: T): Present<T> {
    return new Present<T>(value);
  }

  private constructor(value: T) {
    super();
    this.value = value;
  }

  public get(): T {
    return this.value;
  }

  public getOrElse(other: T): T;
  public getOrElse(): T {
    return this.value;
  }

  public then<TR1 = T, TR2 = never>(
    onfulfilled?: Suspicious<UnaryFunction<T, TR1 | PromiseLike<TR1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, TR2 | PromiseLike<TR2>>>
  ): PromiseLike<TR1 | TR2> {
    const promise: Promise<T> = new Promise<T>((resolve: Resolve<T>) => {
      resolve(this.value);
    });

    return promise.then<TR1, TR2>(onfulfilled, onrejected);
  }

  public isPresent(): this is Present<T> {
    return true;
  }

  public ifPresent(consumer: Consumer<T>): void;
  public ifPresent(consumer: AsyncConsumer<T>): PromiseLike<void>;
  public ifPresent(consumer: Consumer<T> | AsyncConsumer<T>): void | PromiseLike<void> {
    return consumer(this.value);
  }

  public filter(predicate: Predicate<T>): Quantum<T> {
    if (predicate(this.value)) {
      return this;
    }

    return Absent.of<T>();
  }

  public map<U>(mapper: UnaryFunction<T, Quantum<U>>): Quantum<U>;
  public map<U>(mapper: UnaryFunction<T, Suspicious<U>>): Quantum<U>;
  public map<U>(mapper: UnaryFunction<T, Quantum<U> | Suspicious<U>>): Quantum<U> {
    return Planck.maybe<U>(mapper(this.value));
  }

  public toSuperposition(): Superposition<T, QuantumError> {
    return Alive.of<T, QuantumError>(this.value);
  }
}
