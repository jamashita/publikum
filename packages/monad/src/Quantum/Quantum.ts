import { Noun } from '@jamashita/publikum-interface';
import {
    AsyncConsumer, Consumer, Predicate, Suspicious, UnaryFunction
} from '@jamashita/publikum-type';

import { Superposition } from '../Superposition/Superposition';
import { Absent } from './Absent';
import { QuantumError } from './Error/QuantumError';
import { Present } from './Present';

type QuantumType = 'Present' | 'Absent';

export abstract class Quantum<T, N extends QuantumType = QuantumType> implements Noun<N> {
  public abstract readonly noun: N;

  protected constructor() {
    // NOOP
  }

  public abstract get(): T;

  public abstract getOrElse(other: T): T;

  public abstract ifPresent(consumer: Consumer<T>): void;
  public abstract ifPresent(consumer: AsyncConsumer<T>): Promise<void>;

  public abstract filter(predicate: Predicate<T>): Quantum<T>;

  public abstract map<U>(mapper: UnaryFunction<T, Quantum<U>>): Quantum<U>;
  public abstract map<U>(mapper: UnaryFunction<T, Suspicious<U>>): Quantum<U>;

  public abstract toSuperposition(): Superposition<T, QuantumError>;

  public isPresent(): this is Present<T> {
    return false;
  }

  public isAbsent(): this is Absent<T> {
    return false;
  }
}
