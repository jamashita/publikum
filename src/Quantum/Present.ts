import { Alive, Superposition } from '../Superposition';
import { AsyncConsumer, Consumer, MonoFunction, Predicate, Suspicious } from '../Type';
import { Absent } from './Absent';
import { maybe } from './Maybe';
import { Quantum } from './Quantum';
import { QuantumError } from './QuantumError';

export class Present<T> extends Quantum<T> {
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

  public isPresent(): this is Present<T> {
    return true;
  }

  public ifPresent(consumer: Consumer<T>): void;
  public ifPresent(consumer: AsyncConsumer<T>): Promise<void>;
  public ifPresent(consumer: Consumer<T> | AsyncConsumer<T>): void | Promise<void> {
    return consumer(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public orElse(other: T): T {
    return this.value;
  }

  public filter(predicate: Predicate<T>): Quantum<T> {
    if (predicate(this.value)) {
      return this;
    }

    return Absent.of<T>();
  }

  public map<U>(mapper: MonoFunction<T, Suspicious<U>>): Quantum<U> {
    const result: Suspicious<U> = mapper(this.value);

    return maybe<U>(result);
  }

  public toSuperposition(): Superposition<T, QuantumError> {
    return Alive.of<T, QuantumError>(this.value);
  }
}
