import {
    AsyncConsumer, Consumer, MonoFunction, Predicate, Suspicious
} from '@jamashita/publikum-type';

import { Dead } from '../Superposition/Dead';
import { Superposition } from '../Superposition/Superposition';
import { QuantumError } from './Error/QuantumError';
import { Quantum } from './Quantum';

export class Absent<T> extends Quantum<T> {
  public readonly noun: 'Absent' = 'Absent';

  private static readonly INSTANCE: Absent<void> = new Absent();

  public static of(): Absent<void>;
  public static of<T>(): Absent<T>;
  public static of<T = void>(): Absent<T> {
    return Absent.INSTANCE.transform<T>();
  }

  private constructor() {
    super();
  }

  public get(): never {
    throw new QuantumError('IS NOT PRESENT');
  }

  public getOrElse(other: T): T {
    return other;
  }

  public isAbsent(): this is Absent<T> {
    return true;
  }

  public ifPresent(consumer: Consumer<T>): void;
  public ifPresent(consumer: AsyncConsumer<T>): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifPresent(consumer: Consumer<T> | AsyncConsumer<T>): void | Promise<void> {
    // NOOP
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(predicate: Predicate<T>): Absent<T> {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<U>(mapper: MonoFunction<T, Suspicious<U>>): Quantum<U> {
    return this.transform<U>();
  }

  private transform<U>(): Absent<U> {
    return (this as never) as Absent<U>;
  }

  public toSuperposition(): Superposition<T, QuantumError> {
    return Dead.of<T, QuantumError>(new QuantumError('IS NOT PRESENT'));
  }
}
