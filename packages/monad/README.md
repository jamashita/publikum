# Publikum/Monad

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

![CI](https://github.com/jamashita/publikum/workflows/CI/badge.svg)

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

## Unscharferelation

Unscharferlation is an `Optional` package for TS that can deal with Promise.

### What is `Optional`?

Many languages have `null`(`nil`) to describe that has no reference. Besides, JavaScript has `undefined` as well. These
2 types mean that they do not have values.

### `null, undefined` do not have wrapper classes

Primitive types in JavaScript are they.

* `undefined`
* `null`
* `boolean`
* `number`
* `string`
* `symbol`
* `bigint`

`boolean, number, string, symbol, bigint` have wrappers.

As usual, everyone might not consider that the primitive types only focus on the values themselves, and do not have
methods. Then, why can we get the length of the text by typing `str.length`? It is because JavaScript implicitly
converts them to their wrappers. this conversion is called `autoboxing`, but I would not talk about it anymore because
this feature does not have any relationship to the next section.

### The code may be aborted when `null, undefined` given

Because of `null, undefined` do not have wrappers, that means, they do not have properties nor methods. It makes
abortion to make accesses to their properties or methods.  
(JavaScript will throw `TypeError`)

```typescript
null.length;
// TypeError: Cannot read property 'length' of null

undefined.length;
// TypeError: Cannot read property 'length' of undefined

null();
// TypeError: null is not a function

undefined();
// TypeError: undefined is not a function
```

### Otherwise, in Java

In Java, we can not only put its instance but also `null` when the type is not primitive types but reference types. This
feature remains vast of catastrophes when one makes applications, one has to always pay attention to whether `null`
given or not, and also has to consider where `null` would not be given.  
(Nowadays, some annotations guarantee those values are not `nullable`)

In Java, engineers that are not good at error handing can easily return `null`. This is quite problematic but actually
allowed, and this `null` function enables such an arrogant way.

### In TypeScript

TypeScript can be null safety (this is configurable by changing the settings in `tsconfig.json`, but I strongly
recommend turning it on). `null, undefined` cannot be put even if the variable is not allowed `null, undefined`.

```typescript
const girl: Mankind = null;
// Type 'null' is not assignable to type 'Mankind'

const boy: Mankind = undefined;
// Type 'undefined' is not assignable to type 'Mankind'
```

If you want to be tolerant, you can use `Union types`.

```typescript
const girl: Mankind | null = null;
const boy: Mankind | undefined = undefined;
```

You can do below as well, of course.

```typescript
const girl: null = null;
const boy: undefined = undefined;
const baby: void = undefined;
```

`Union types` are really useful but `Union types` will delegate the type check for the caller.

### `Optional`

`Optional` enables to avoid this problem. `Optional` describes that may have, or may not have.

In general, `Optional` is an abstract class, and it has 2 concrete classes, one is `Some` that describes that has a
value, another is `None` that describes that has no values. `Optional` can force users to consider whether the instance
has a value or no.

### `Optional` in TypeScript

To build `Optional`, you can easily achieve by using `Union types`, and `Discriminated unions`.

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

We can immediately find that is `Some<T>, None` only if we check `optional.present`.

```typescript
const optional: Optional<User> = findUserByID(1999);

if (optional.present) {
  // This optional is Some<User>
}
else {
  // This optional is None
}
```

### A new obstacle

`Promise` brings us a tragedy.

`Promise` is a class for asynchronous action in JavaScript and TypeScript. This class is essential for nowadays
TypeScript development. This class can be a problem. Because this is just a ticket for the future response. This does
actually exist, `Promise` does not guarantee that the future response exists. So `Optional<Promise<T>>` is
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

- We can build applications without considering the value is `nullable` or not
- We can build applications without considering the value is Synchronous or Asynchronous

## Unscharferelation helpers

### Heisenberg<P>

This is an interface, this retains the result and also describes the status for `Unshcarferelation`.

4 classes implement `Heisenberg` and each of them means

* `Present<P>`
  * This means fulfilled, and retains the very instance as expected
* `Absent<P>`
  * This means **recoverable** rejected, and retains no values
* `Lost<P>`
  * This means rejected, and retains `unknown` value
    * This is equivalent to `rejected Promise` but this is not **recoverable**
* `Uncertain<P>`
  * This means pending, the result is not ready

`Present, Absent, Lost` are called SETTLED, that means, when it would be once, would never change to others.

### Epoque<M>

This is an interface that is alternative for `resolve, reject` in `new Promise()`. This
can `accept(), decline(), and throw()`.

When accepted one, the result would be `Present`, declined once, the result would be `Absent`, thrown once, the result
would be `Lost`.`

## Unscharfeleration API

### (static) `of<P>(func: UnaryFunction<Epoque<M>, unknown>): Unscharferelation<P>`

Forge a `Unscharferelation` instance. The callback argument is not the same as `Promise`, such as

```typescript
Unscharferelation.of<ResponseBody>((epoque: Epoque<ResponseBody>) => {
  request.get('https://....', (res: Response) => {
    try {
      if (res.body === null || res.body === undefined) {
        return epoque.decline();
      }

      return epoque.accept(res.body);
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

### (static) `all<P>(unscharferelations: Iterable<Unscharferelation<P>>): Unscharferelation<Array<P>>`

Alike `Promise.all()`, it aggregates all `Unscharferelations`.

* Only when all `Unscharferelations` are Present, returns Present `Unscharferelation<Array<P>>`
* When at least one of them is to be Absent, returns Absent `Unscharferelation<Array<P>>`
* When at least one of them is to be Lost, Returns Lost `Unscharferelation<Array<P>>`

When Absent and Lost are satisfied together, `Unscharfeleration` is going to be `Lost`.

### (static) `anyway<P>(unscharferelations: Iterable<Unscharferelation<P>>): Promise<Array<Heisenberg<P>>>`

Unlike to `Unscharferelation.all()`, this executes all `Unscharfelerations` even if they are going to be Absent or Lost.

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

### Otherwise, in Java

Exceptions in Java can be thrown when the class implements `Throwable`, and it also supports `thrown` clause that
describes the methods may throw such Exceptions to the callee.

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
