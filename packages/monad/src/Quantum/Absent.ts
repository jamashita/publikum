import {
    AsyncConsumer, Consumer, Predicate, Reject, Resolve, Suspicious, UnaryFunction
} from '@jamashita/publikum-type';

import { Dead } from '../Superposition/Dead';
import { Superposition } from '../Superposition/Superposition';
import { QuantumError } from './Error/QuantumError';
import { Quantum } from './Quantum';

export class Absent<T> extends Quantum<T, 'Absent'> {
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

  public then<TR1 = T, TR2 = never>(
    onfulfilled?: Suspicious<UnaryFunction<T, TR1 | PromiseLike<TR1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, TR2 | PromiseLike<TR2>>>
  ): PromiseLike<TR1 | TR2> {
    const promise: Promise<T> = new Promise<T>((resolve: Resolve<T>, reject: Reject) => {
      reject(new QuantumError('IS NOT PRESENT'));
    });

    return promise.then<TR1, TR2>(onfulfilled, onrejected);
  }

  public isAbsent(): this is Absent<T> {
    return true;
  }

  public ifPresent(consumer: Consumer<T>): void;
  public ifPresent(consumer: AsyncConsumer<T>): PromiseLike<void>;
  public ifPresent(): void | PromiseLike<void> {
    // NOOP
  }

  public filter(predicate: Predicate<T>): Absent<T>;
  public filter(): Absent<T> {
    return this;
  }

  public map<U>(mapper: UnaryFunction<T, Quantum<U>>): Quantum<U>;
  public map<U>(mapper: UnaryFunction<T, Suspicious<U>>): Quantum<U>;
  public map<U>(): Quantum<U> {
    return this.transform<U>();
  }

  private transform<U>(): Absent<U> {
    return (this as never) as Absent<U>;
  }

  public toSuperposition(): Superposition<T, QuantumError> {
    return Dead.of<T, QuantumError>(new QuantumError('IS NOT PRESENT'));
  }
}
