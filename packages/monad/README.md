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

### What is `Optional` ?

Many languages have `null`(`nil`) in order to describe that has no reference. In addition, JavaScript has `undefined` as
well. These 2 types mean that, they do not have values.

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
methods. Then, why can we get the length of the text by typing `str.length` ? It is because that JavaScript implicitly
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
feature remains vast of catastrophes when one makes applications, one has to always pay attention whether `null` given
or not, and also has to consider from where `null` would not be given.  
(Nowadays, there are some annotations that guarantee those values are not `nullable`)

In Java, engineers that are not good at error handing can easily return `null`. This is quite problematic but actually
allowed, and this `null` function enables such arrogant way.

### In TypeScript

TypeScript can be `null safety` (this is configurable by changing the settings in `tsconfig.json`). `null, undefined`
cannot be put even if the variable is not allowed `null, undefined`.

```typescript
const girl: Mankind = null;
// Type 'null' is not assignable to type 'Mankind'

const boy: Mankind = undefined;
// Type 'undefined' is not assignable to type 'Mankind'
```

If you want to be tolerant, you can use 'Union types'.

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

In general, `Optional` is abstract, and it has 2 concrete classes, one is `Some` that describes that has a value,
another is `None` that describes that has no values. `Optional` can force to users consider whether the instance has a
value or no.

### `Optional` in TypeScript

To build `Optional`, you can easily achieve by using `Union types`, and furthermore `Discriminated unions`

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

We can immediately find that is `Some, None` only if we check `optional.present`.

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

`Primise` brings us a tragedy.

`Promise` is a class for asynchronous action in JavaScript, TypeScript. This class is essential for nowadays TypeScript
development. And this class can be problem. Because this is just a ticket for the future response. This does actually
exist, but this does not guarantee that the future response exists. So `Optional<Promise<T>>` is
definitely `Some<Promise<T>>`. In short, `Optional` of `Promise` does not make any sense.

```typescript
const optional: Optional<Promise<User | null>> = findUserByID(1999);

if (optional.present) {
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

This is an interface, this retains the result and also describes status for `Unshcarferelation`.

4 classes implement `Heisenberg` and each of them means

* `Present<P>`
  * This means fulfilled, and retains the very instance as expected
* `Absent`
  * This means rejected, and retains no values
* `Lost`
  * This means rejected, and retains `unknown` value
    * This is equivalent to `rejected Promise`
* `Uncertain`
  * This means pending, the result is not ready

`Present<P>, Absent, Lost` are SETTLED states, that means, when it would be once, would never change to others.

### Epoque<P>

This is an interface that is alternative for `resolve, reject` in `Promise.of()`. This
can `accept(), decline(), and throw()`.

When accepted one, the result would be `Present<P>`, declined once, the result would be `Absent`, thrown once, the
result would be `Lost`.`

## Unscharfeleration API

### (static) `of<P>(func: UnaryFunction<Epoque<P>, unknown>): Unscharferelation<P>`

Forge a `Unscharferelation` instance. The callback argument is not same as `Promise`, Such as

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

Like `Promise.all()`, it aggregates all `Unscharferelations`.

* Only when all `Unscharferelations` are Present, returns `Present<Array<P>>`
* When at least one of them are to be Absent, returns `Absent`
* When at least one of them are to be Lost, Returns `Lost`

When Absent and Lost are satisfied together, `Unscharfeleration` is going to be `Lost`.

### (static) `anyway<P>(unscharferelations: Iterable<Unscharferelation<P>>): Promise<Array<Heisenberg<P>>>`

Unlike to `Unscharferelation.all()`, this absolutely execute all `Unscharfelerations` even if they are going to be
Absent or Lost.

### (static) `ofHeisenberg<P>(heisenberg: Heisenberg<P>): Unscharferelation<P>`

Forge a `Unscharferelation` instance. The callback argument is not same as `Promise`, Such as

* Returns `Present<P>` when non

### (static) `present<P>(value: SyncAsync<P>): Unscharferelation<P>`

* When `SyncAsync<non-null>` value given, returns Present Unscharferelation
* When rejected `Promise` given, returns Lost Unscharferelation

### (static) `absent<P>(value: SyncAsync<null | undefined>): Unscharferelation<P>`

* When `SyncAsync<non-null>` given, returns Absent Unscharferelation
* When rejected `Promise` given, returns Lost Unscharferelation

### (instance) `get(): Promise<P>`

Get the retaining value.

### (instance) `terminate(): Promise<Heisenberg<P>>`

`Unscharferelation` supports method chain. this method is prepared in order to wait all the chains done.  
Please use this method in order to avoid to be thrown errors when use `get()` when its `Unscharfeleration` is going to
be `Absent, Lost`.

### (instance) `filter(predicate: Predicate<P>): Unscharferelation<P>`

If `Unscharferelation` is present, `predicate` is invoked and if `predicate` returns false, `Unscharferelation` becomes
Absent.

### (instance) `map<Q = P>(mapper: UnaryFunction<P, SyncAsync<Unscharferelation<Q> | Q>>): Unscharferelation<Q>`

* When `Unscharferelation` is Present, `mapper` is going to be invoked and the next `Unscharferelation`
  becomes `Present, Absent` due to the return value
  * When error thrown, the next `Unscharferelation` is going to be `Lost`
* When `Unscharferelation` is not Present, `mapper` is not going be invoked

### (instance) `recover<Q = P>(mapper: Supplier<SyncAsync<Unscharferelation<Q> | Q>>): Unscharferelation<P | Q>;`

* When `Unscharferelation` is Absent, `mapper` is going to be invoked and the next `Unscharferelation`
  becomes `Present, Absent` due to the return value
  * When error thrown, the next `Unscharferelation` is going to be `Lost`
* When `Unscharferelation` is not Absent, `mapper` is not going be invoked

### (instance) `ifPresent(consumer: Consumer<P>): this`

### (instance) `ifAbsent(consumer: Consumer<P>): this`

### (instance) `ifLost(consumer: Consumer<P>): this`

### (instance) `peek(peek: Peek): this`

These methods are used for peeking.