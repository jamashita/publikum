# Publikum/Monad

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

![CI](https://github.com/jamashita/publikum/workflows/CI/badge.svg)

## Installation

```
npm install --save @jamashita/publikum-monad
yarn add @jamashita/publikum-monad                      
```

## What this package supplies

1. `Unscharferelation`
2. `Superposition`

### Prerequisite

These are the definition of type aliases for the class description.

```typescript
type UnaryFunction<I, O> = (arg: I) => O;
type Predicate<T> = (arg: T) => boolean;
type Consumer<T> = (arg: T) => unknown | void;
type Supplier<T> = () => T;
type Peek = () => unknown | void;
type SyncAsync<T> = T | PromiseLike<T>;
```

## What is Unscharferelation?

This is an `Optional` class that can deal with `Promise`.

### Motivation

[HERE!](https://github.com/jamashita/publikum/wiki/Unscharferelation---Motivation)

#### Prerequisite for Unscahrferelation

[ALSO HERE!](https://github.com/jamashita/publikum/wiki/Unscharferelation---Motivation#helpers)

### Optional is easily built in TypeScript

By doing this, you can build sooooo easily.

```typescript
type Some<T> = Readonly<{
  present: true;
  value: T;
}>;

type None = Readonly<{
  present: false;
}>;

type Optional<T> = Some<T> | None;
```

### An obstacle appears!

`Promise` brings us a tragedy.

`Promise` is a class for asynchronous action in JavaScript and TypeScript. This class is essential for nowadays
TypeScript development. This class can be a problem, because this is just a ticket for the future response. `Promise`
does actually exist, but not guarantee that the future response exists. So `Optional<Promise<T>>` is
definitely `Some<Promise<T>>`. In other words, `Optional<Promise<T>>` does not make any sense.

```typescript
const optional: Optional<Promise<User | null>> = findUserByID(1999);

if (optional.present) {
  // finally you have to check the value is null or not!
  const res: User | null = await optional.value;
}
else {
  // ...
}
```

## What Unscharfeleration enables

- Unscharfeleration enables us not to consider the value is `nullable` or not
- Unscharfeleration enables us not to consider the value is Synchronous or Asynchronous

## Unscharfeleration API

What is Epoque? What is Heisenberg?
[See here!](https://github.com/jamashita/publikum/wiki/Unscharferelation---Motivation#helpers)

### (static) `of<P>(func: UnaryFunction<Epoque<M>, unknown>): Unscharferelation<P>`

Forge a `Unscharferelation` instance. The callback argument is not the same as `Promise`, such as

```typescript
Unscharferelation.of<ResponseBody>((epoque: Epoque<ResponseBody>) => {
  db.query('SELECT * FROM ...', (res?: Response) => {
    try {
      if (res === null || res === undefined) {
        return epoque.decline();
      }

      return epoque.accept(res);
    }
    catch (err: unknown) {
      return epoque.throw(err);
    }
  });
});
```

### (static) `maybe<P>(value: SyncAsync<P>): Unscharferelation<P>`

* When `SyncAsync<non-null>` value given, returns Present Unscharferelation
* When `SyncAsync<null | undefined>` given, returns Absent Unscharferelation
* When rejected `Promise` given, returns Lost Unscharferelation

```typescript
Unscharferelation.maybe<null>(null);
// Absent Unscharferelation
Unscharferelation.maybe<undefined>(undefined);
// Absent Unscharferelation
Unscharferelation.maybe<null>(Promise.resolve<null>(null));
// Absent Unscharferelation
Unscharferelation.maybe<undefined>(Promise.resolve<undefined>(undefined));
// Absent Unscharferelation
```

### (static) `all<P>(unscharferelations: Iterable<Unscharferelation<P>>): Unscharferelation<Array<P>>`

Alike `Promise.all()`, it aggregates all `Unscharferelations`.

* Only when all `Unscharferelations` are Present, returns Present Unscharferelation
* When at least one of them is to be Absent, returns Absent Unscharferelation
* When at least one of them is to be Lost, Returns Lost Unscharferelation

```typescript
const array: Array<Unscharferelation<Response>> = [unscharferelation1, unscharferelation2, unscharferelation3];
const unscharferelations: Unscharferelation<Array<Response>> = Unscharferelation.all<Response>(array);
```

When Absent and Lost are satisfied together, `Unscharfeleration` will be `Lost`.

### (static) `anyway<P>(unscharferelations: Iterable<Unscharferelation<P>>): Promise<Array<Heisenberg<P>>>`

Unlike to `Unscharferelation.all()`, this executes all `Unscharfelerations` even if they are going to be Absent or Lost.

```typescript
const array: Array<Unscharferelation<Response>> = [unscharferelation1, unscharferelation2, unscharferelation3];
const heisenbergs: Array<Heisenberg<Response>> = await Unscharferelation.anyway<Response>(array);
```

### (static) `ofHeisenberg<P>(heisenberg: Heisenberg<P>): Unscharferelation<P>`

Forge a `Unscharferelation` instance.

### (static) `present<P>(value: SyncAsync<P>): Unscharferelation<P>`

* When `SyncAsync<non-null>` value given, returns Present Unscharferelation
* When rejected `Promise` given, returns Lost Unscharferelation

### (static) `absent<P>(value: SyncAsync<null | undefined>): Unscharferelation<P>`

* When `SyncAsync<non-null>` given, returns Absent Unscharferelation
* When rejected `Promise` given, returns Lost Unscharferelation

### (instance) `get(): Promise<P>`

Get the retaining value.

* When `Unscharferelation` is Absent, `UnscharferelationError` will be thrown
* When `Unscharferelation` is Lost, its retaining value will be thrown

### (instance) `terminate(): Promise<Heisenberg<P>>`

`Unscharferelation` supports method chain. This method is prepared to wait for all the chains done.  
Please use this method to avoid to be thrown errors when using `get()` when its `Unscharfeleration` is going to
be `Absent, Lost`.

### (instance) `filter(predicate: Predicate<P>): Unscharferelation<P>`

If `Unscharferelation` is Present, `predicate` is invoked and if it returns false, `Unscharferelation` becomes Absent.

### (instance) `map<Q = P>(mapper: UnaryFunction<P, SyncAsync<Unscharferelation<Q> | Q>>): Unscharferelation<Q>`

* When `Unscharferelation` is Present, `mapper` is going to be invoked and the next `Unscharferelation`
  becomes `Present, Absent` due to the return value
  * When an error is thrown, the next `Unscharferelation` is going to be `Lost`
* When `Unscharferelation` is not Present, `mapper` is not going be invoked

### (instance) `recover<Q = P>(mapper: Supplier<SyncAsync<Unscharferelation<Q> | Q>>): Unscharferelation<P | Q>;`

* When `Unscharferelation` is Absent, `mapper` is going to be invoked and the next `Unscharferelation`
  becomes `Present, Absent` due to the return value
  * When an error is thrown, the next `Unscharferelation` is going to be `Lost`
* When `Unscharferelation` is not Absent, `mapper` is not going be invoked

### (instance) `ifPresent(consumer: Consumer<P>): this`

### (instance) `ifAbsent(consumer: Consumer<void>): this`

### (instance) `ifLost(consumer: Consumer<unknown>): this`

### (instance) `peek(peek: Peek): this`

These methods are used for peeking.

## Chaining

`Unscharferelation` supports method chain. You can chan as much as you want and get the result by adding `terminate()`
at the last of them.

```typescript
const address: string = Unscharferelation.maybe<Response>(userRepositoty.selectByName('foo bar')).map<User>((res: Response) => {
  return res.user;
}).map<Company>((user: User) => {
  return companyRepository.findByUserID(user.userID);
}).map<string>((company: Company) => {
  return company.address;
}).recover<string>((err: UnscharferelationError) => {
  // ...

  return 'xxxx';
}).terminate();
```

## Superposition

Superposition is a `Try` package for TS that can deal with Promise.

### What is `Try`?

Many languages have `Exception` function. When exceptions are thrown, that method immediately shut the process and until
the exception is caught, the shut-process goes up to the callees.

`Error` is called for `Exception` in JavaScript, TypeScript, but they are equivalent.

### Catch errors

We can catch errors by using `try-catch` syntax. put the methods that may throw errors in `try` and if errors are
thrown, `catch` can catch them.

```typescript
try {
  method();
}
catch (err: unknown) {
  // ...
}
```

### A tragedy in TypeScript

TypeScript can catch errors, but these errors must be `any, unknown` in TypeScript because JavaScript can throw whatever
you want, even if it is string, other primitive types, or something else.

### In TypeScript

TypeScript does not support `throws`. It cannot check errors. The caller has to investigate and know what is going to be
thrown when they call methods in advance.

### `Try`

`Try` enables us to avoid this problem. `Try` describes that might succeed, or might fail.

In general, `Try` is an abstract class, and it has 2 concrete classes, one is `Success` that describes that has an
expected value, another is `Failure` that describes that has an unexpected value (mainly it would be an exception)
. `Try` can force users to consider whether the instance is an expected value or no.

### `Try` in TypeScript

To build `Try`, you can easily achieve by using `Union types`, and `Discriminated unions.

```typescript
type Success<T> = Readonly<{
  success: true;
  value: T;
}>;

type Failure = Readonly<{
  success: false;
  error: unknown;
}>;

type Try<T> = Success<T> | Failure;
```

We can immediately find that is `Success<T>, Failure` only if we check `tried.success`.

`Discriminated unions`のおかげで`tried.success`の値さえ判別できればそれが`Success, Failure`のどちらかがわかります。

```typescript
const tried: Try<UserID> = createUser(user);

if (tried.success) {
  // This tried is Success<UserID>
}
else {
  // This tried is Failure
}
```

### Supports error generic

This `Try` only tell us that has succeeded or failed, this is not convenient, So I extended `Try` feature to support
error generic. Now `Try<T>` is `Try<T, E>`.

### A new obstacle

`Promise` brings us a tragedy.

`Promise` is a class for asynchronous action in JavaScript and TypeScript. This class is essential for nowadays
TypeScript development. This class can be a problem. Because this is just a ticket for the future response. `Promise`
absolutely does not throw errors but its retaining action may throw errors. `Try<Promise<T>, E>`
is definitely `Success<Promise<T>, E>`. In other words, `Try<Promise<T>, E>` does not make any sense.

## What Superposition enables

- We can build applications without considering nor investigating the method throws errors
- We can build applications without considering the action is Synchronous or Asynchronous

## Superposition helpers

### `Schrodinger<A, D>`

This is an interface, this retains either result, succeeded one or failed one, and also describes the status
for `Superposition`.

4 classes implement `Schrodinger` and each of them means

* `Alive<A, D>`
  * This means fulfilled, and retains the succeeded instance as expected
* `Dead<A, D>`
  * This means **recoverable** rejected, and retains no errors. Errors must be one or more of the instances of the
    generic D
* `Contradiction<A, D>`
  * This means rejected, and retains `unknown` value
    * This is equivalent to `rejected Promise` but this is not **recoverable**
* `Still<A, D>`
  * This means pending, the result is not ready

`Alive, Dead, Contradiction` are called SETTLED, that means, when it would be once, would never change to others.

#### Chrono<M, R>

This is an interface that is alternative for `resolve, reject` in `new Promise()`. This
can `accept(), decline(), and throw()`.

When accepted one, the result would be `Alive`, declined once, the result would be `Dead`, thrown once, the result would
be `Contradiction`.`

## Superposition API

### (static) `of<A, D>(func: UnaryFunction<Chrono<A, D>, unknown>, ...errors: Array<DeadConstructor<D>>): Superposition<A, D>`

Forge a `Superposition` instance. The callback argument is not the same as `Promise`, such as

```typescript
Superposition.of<number, SyntaxError>((chrono: Chrono<number, SyntaxError>) => {
  try {
    return chrono.accept(JSON.parse(str));
  }
  catch (err) {
    if (err instanceof SyntaxError) {
      return chrono.decline(err);
    }

    return chrono.throw(err);
  }
}, SyntaxError);
```

### (static) `playground<A, D>(supplier: Supplier<SyncAsync<A>>, ...errors: Array<DeadConstructor<D>>): Superposition<A, D>`

* When `SyncAsync<non-error>` value is given, returns Alive Superposition
* When `SyncAsync<error>` given, returns Dead Superposition
* When a thrown error is not contained in `errors`, returns Contradiction Superposition

### (static) `all<A, D>(superpositions: Iterable<Superposition<A, D>>): Superposition<Array<A>, D>`

Alike `Promise.all()`, it aggregates all `Superpositions`.

* Only when all `Superpositions` are Alive, returns Alive `Superposition<Array<A>, D>`
* When at least one of them is to be Dead, returns Dead `Superposition<Array<A>, D>`
* When at least one of them is to be Contradiction, Returns Contradiction `Superposition<Array<A>, D>`

When Dead and Contradiction are satisfied together, `Superposition` is going to be `Contradiction`.

### (static) `anyway<A, D>(superpositions: Iterable<Superposition<A, D>>): Promise<Array<Schrodinger<A, D>>> {`

Unlike to `Superposition.all()`, this executes all `Superpositions` even if they are going to be Dead or Contradiction.

### (static) `ofSchrodinger<AT, DT extends Error>(schrodinger: Schrodinger<AT, DT>, ...errors: ReadonlyArray<DeadConstructor<DT>>): Superposition<A, D>`

Forge a `Superposition` instance.

### (static) `alive<A, D>(value: SyncAsync<A>, ...errors: Array<DeadConstructor<D>>): Superposition<A, D> {`

* When `SyncAsync<non-error>` value is given, returns Alive Superposition
* When rejected `Promise` given, returns Contradiction Superposition

### (static) `dead<A, D>(error: PromiseLike<A> | D, ...errors: Array<DeadConstructor<D>>): Superposition<A, D>`

* When `SyncAsync<error>` given, returns Dead Superposition
* When rejected `Promise` given, returns Dead or Contradiction Superposition
  * When an error is contained in `errors`, returns Dead Superposition, otherwise returns Contradiction Superposition

### (instance) `get(): Promise<A>`

Get the retaining value.

### (instance) `terminate(): Promise<Schrodinger<A, D>>`

`Superposition` supports method chain. This method is prepared to wait for all the chains done.  
Please use this method to avoid to be thrown errors when using `get()` when its `Superposition` is going to
be `Dead, Contradiction`.

### (instance) `filter(predicate: Predicate<A>): Superposition<A, D | SuperpositionError>`

if `Superposition` is Alive, `predicate` is invoked and if it returns false, `Superposition` becomes Dead.

### (instance) `map<B = A, E = D>(mapper: UnaryFunction<A, SyncAsync<Superposition<B, E> | B>>, ...errors: Array<DeadConstructor<E>>): Superposition<B, D | E>`

* When `Superposition` is Alive, `mapper` is going to be invoked and the next `Superposition`
  becomes `Alive, Dead` due to the return value and error
  * When an error is thrown, as far as its retaining `errors` and given `errors` contain the error, the
    next `Superposition` is going to be `Dead`, otherwise, `Superposition` is going to be `Contradiction`
* When `Superposition` is not Alive, `mapper` is not going be invoked

### (instance) `recover<B = A, E = D>(mapper: UnaryFunction<D, SyncAsync<Superposition<B, E> | Detoxicated<B>>>, ...errors: Array<DeadConstructor<E>>): Superposition<A | B, E>`

* When `Superposition` is Dead, `mapper` is going to be invoked and the next `Superposition`
  becomes `Alive, Dead` due to the return value and error
  * When an error is thrown, as far as given `errors` contain the error, the next `Superposition` is going to be `Dead`
    otherwise, `Superposition` is going to be `Contradiction`
* When `Superposition` is not Dead, `mapper` is not going be invoked

### (instance) `transform<B = A, E = D>(alive: UnaryFunction<A, SyncAsync<Superposition<B, E> | B>>, dead: UnaryFunction<D, SyncAsync<Superposition<B, E> | B>>, ...errors: Array<DeadConstructor<E>>): Superposition<B, E>`

* When `Superposition` is Alive, `alive` is going to be invoked and the next `Superposition`
  becomes `Alive, Dead` due to the return value and error
  * When an error is thrown, as far as given `errors` contain the error, the next `Superposition` is going to be `Dead`,
    otherwise, `Superposition` is going to be `Contradiction`
* When `Superposition` is Dead, `dead` is going to be invoked and the next `Superposition`
  becomes `Alive, Dead` due to the return value and error
  * When an error is thrown, as far as given `errors` contain the error, the next `Superposition` is going to be `Dead`
    otherwise, `Superposition` is going to be `Contradiction`
* When `Superposition` is not Alive nor Dead, `alive, dead` are not going be invoked

### (instance) `ifAlive(consumer: Consumer<A>): this`

### (instance) `ifDead(consumer: Consumer<D>): this`

### (instance) `ifContradiction(consumer: Consumer<unknown>): this`

### (instance) `peek(peek: Peek): this`

These methods are used for peeking.
