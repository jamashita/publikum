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

1. [Unscharferelation](https://github.com/jamashita/publikum/blob/main/packages/monad/README.md#what-is-unscharferelation)
2. [Superposition](https://github.com/jamashita/publikum/blob/main/packages/monad/README.md#what-is-superposition)

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

## What is Superposition?

This is a `Try` class that can deal with `Promise`.

### Motivation

[HERE!](https://github.com/jamashita/publikum/wiki/Superposition-Motivation)

#### Prerequisite for Superposition

[ALSO HERE!](https://github.com/jamashita/publikum/wiki/Superposition-Motivation)

### Try is easily built in TypeScript

By doing this, you can easily build sooooo easily.

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

### An obstacle appears

`Promise` brings us a tragedy.

`Promise` is a class for asynchronous action in JavaScript and TypeScript. This class is essential for nowadays
TypeScript development. This class can be a problem, because this is just a ticket for the future response. `Promise`
absolutely does not throw errors but its retaining action may throw them. `Try<Promise<T>, E>`
is definitely `Success<Promise<T>, E>`. In other words, `Try<Promise<T>, E>` does not make any sense.

```typescript
const tried: Try<Promise<UserID>> = createUser(user);

if (tried.success) {
  // does not this really throw any errors?
  try {
    const userID: UserID = await tried.value;
  }
  catch (err: unknown) {
    // ...
  }
}
else {
  // This tried is Failure
}
```

## What Superposition enables

- Superposition enables us not to consider nor investigate the method throws errors
- Superposition enables us not to consider the action is Synchronous or Asynchronous

## Superposition API

What is Chrono? What is
Schrodinger? [See here!](https://github.com/jamashita/publikum/wiki/Superposition-Motivation#helpers)

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

```typescript
Superposition.playground<User, DBError>(() => {
  return db.query('SELECT * FROM ....');
}, DBError);
```

### (static) `all<A, D>(superpositions: Iterable<Superposition<A, D>>): Superposition<Array<A>, D>`

Alike `Promise.all()`, it aggregates all `Superpositions`.

* Only when all `Superpositions` are Alive, returns Alive `Superposition<Array<A>, D>`
* When at least one of them is to be Dead, returns Dead `Superposition<Array<A>, D>`
* When at least one of them is to be Contradiction, Returns Contradiction `Superposition<Array<A>, D>`

```typescript
const array: Array<Superposition<Response>> = [superposition1, superposition2, superposition3];
const superpositions: Superposition<Array<Response>> = Superposition.all<Response>(array);
```

When Dead and Contradiction are satisfied together, `Superposition` is going to be `Contradiction`.

### (static) `anyway<A, D>(superpositions: Iterable<Superposition<A, D>>): Promise<Array<Schrodinger<A, D>>> {`

Unlike to `Superposition.all()`, this executes all `Superpositions` even if they are going to be Dead or Contradiction.

```typescript
const array: Array<Superposition<Response>> = [superposition1, superposition2, superposition3];
const schrodingers: Array<Schrodinger<Response>> = await Superposition.anyway<Response>(array);
```

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

## Chaining

`Superposition` supports method chain. You can chan as much as you want and get the result by adding `terminate()`
at the last of them.

```typescript
const address: string = Superposition.playground<Response, UserError>(() => {
  return userRepositoty.selectByName('foo bar');
}, UserError).map<User, UserError>((res: Response) => {
  return res.user;
}).map<Company, UserError | CompanyError>((user: User) => {
  return companyRepository.findByUserID(user.userID);
}, CompanyError).map<string, UserError | CompanyError>((company: Company) => {
  return company.address;
}).recover<string, Error>((err: UserError | CompanyError) => {
  // ...

  return 'xxxx';
}).terminate();
```