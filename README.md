# `Publikum`

Publikum (prononciation /puːblikʊm/) is a TypeScript library for me :))

## What is Publikum?

Publikum is the group of people who are at a play, concert, film, or a public meeting.

## How to use?

Run this command in your JS/TS project.

```
yarn add git+ssh://git@gitlab.com:jamashita/publikum.git#x.y.z
```

`x.y.z` is a specific version. if not , yarn will be trying to download latest one.

## Classes

### Objects
Object re-definition class for OOP programming.

#### Objet
Redefinition class for `Object`. Abstract class for standing for `Nominative`.

#### Entity
Class for `Entity` for DDD. Concrete class for `Objet`.

### ValueObject
Class for `Value object` for DDD. Concrete class for `Objet`

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
Alias for `Optional` for scala.
Applicable for async operation, especially `Promise`.

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
Alias for `Try` class in scala.
Applicable for async operation, especially `Promise`.

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
Clone Objectliteral instance, when the object has circular reference, this operation will throw an Error.

#### Equality
Check euqality Objectliteral instance, when the object has circular reference, this operation will throw an Error.

#### Function
Function type definitions.

#### Kind
Type-determination class.

#### Reference
Check the object has circular reference.

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

### Random
Class for random string, random number.

### TODO
* [ ] `indexDB` repository implementation
* [ ] `file` implementation
* [x] accepts Error constructors in Superposition Epoque
* [ ] implementing cancelable iterator class.
* [ ] mutable collections

## License

[MIT](LICENSE)
