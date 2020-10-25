# Publikum

my reusable playground :)

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

![CI](https://github.com/jamashita/publikum/workflows/CI/badge.svg)

## Requisite

```
> node -v
v14.5.0

> npm -v
6.14.5

> yarn -v
1.22.5
```

## Classes

### Objects

Object re-definition class for OOP programming.

#### Objet

Redefinition class for `Object`. Abstract class for standing for `Nominative`.

#### Entity

Class for `Entity` for DDD. Concrete class for `Objet`.

#### ValueObject

Class for `Value object` for DDD. Concrete class for `Objet`

#### Reference

Check the object has circular reference.

### Collections

Collection classes that are totally wrapping `Array, Map, Set...` in order to data immutability.

#### Collection

Interface for Collection concept.

#### Sequence

Alias for `Array`. Implemented `Collection` and `Nominative`.

#### Address

Alias for `Set`. Implemented `Collection` and `Nominative`.

#### Project

Alias for `Map`. Implemented `Collection` and `Nominative`.

### Repositories

#### AJAX

AJAX implementation.

#### Cache

Cache implementation.

#### MySQL

MySQL Driver.

#### Redis

Redis driver.

#### Request

HTTP Request implementation.

### Monads

#### Unscharferelation

Alias for `Optional` for scala. Applicable for async operation, especially `Promise`.

#### Heisenberg

Interface for standing for `Present` , `Absent` and `Uncertain`.

#### Uncertain

Subclass for `Unscharferelation`, the given value is not settled in `Present` , `Absent`.

#### Absent

Subclass for `Unscharferelation`, it represents `None` case.

#### Present

Subclass for `Unscharferelation`, it represents `Some` case.

#### Lost

Status for representing `pending` for `Promise` .

#### Superposition

Alias for `Try` class in scala. Applicable for async operation, especially `Promise`.

#### Schrodinger

Interface for standing for `Alive` , `Dead` and `Still`.

#### Still

Subclass for `Superposition`, the given value is not settled in `Alive` , `Dead`.

#### Alive

Subclass for `Superposition`, it represents `Success` case.

#### Dead

Subclass for `Superposition`, it represents `Failure` case.

#### Contradiction

Status for representing `pending` for `Promise` .

### Types

Class for type definition.

#### Clone

Clone Object literal, when the object has circular reference, this operation will throw an Error.

#### Equality

Check the equality Object literal, when the object has circular reference, this operation will throw an Error.

#### Function

Function type definitions.

#### Kind

Type-determination class.

#### Value

Value type definitions.

### Others

#### JSONA

Asynchronous Class for serialization and deserialization `JSON`.

#### UUID

Class for UUID.

#### Zeit

Class for Date and Time, using `dayjs`.

#### Digest

Class for string hashing.

#### Random

Class for random string, random number.

### TODO

* [ ] `indexDB` repository implementation
* [ ] implementing cancelable iterator class.
* [ ] utility class for Promise collection manipulation
  * Unscharfeleration
    * [ ] `sequence<P>(arr: Array<Promise<P>>): Promise<Array<P>>;`
  * Superposition
    * [ ] `sequence<A, D>(arr: Array<Promise<A>>): Promise<Array<Schrodinger<A, D>>>;`
* [ ] validation decorator
* [ ] can get constract from DeadContractor.constractor

## Conventional commit

```
git cz
```

## License

[MIT](LICENSE)
