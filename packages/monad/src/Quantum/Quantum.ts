import { Noun } from '@jamashita/publikum-interface';
import {
    AsyncConsumer, Consumer, MonoFunction, Predicate, Suspicious
} from '@jamashita/publikum-type';

import { Superposition } from '../Superposition/Superposition';
import { Absent } from './Absent';
import { QuantumError } from './Error/QuantumError';
import { Present } from './Present';

export abstract class Quantum<T> implements Noun {
  public abstract readonly noun: 'Present' | 'Absent';

  protected constructor() {
    // NOOP
  }

  public abstract get(): T;

  public abstract ifPresent(consumer: Consumer<T>): void;
  public abstract ifPresent(consumer: AsyncConsumer<T>): Promise<void>;

  public abstract orElse(other: T): T;

  public abstract filter(predicate: Predicate<T>): Quantum<T>;

  public abstract map<U>(mapper: MonoFunction<T, Suspicious<U>>): Quantum<U>;

  public abstract toSuperposition(): Superposition<T, QuantumError>;

  public isPresent(): this is Present<T> {
    return false;
  }

  public isAbsent(): this is Absent<T> {
    return false;
  }
}
