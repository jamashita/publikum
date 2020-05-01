# Publikum

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

### Functional programming classes

#### Quantum
Alias for `Optional` for scala. Abstract class for standing for `Present` and `Absent`.

#### Absent
Subclass for `Quantum`, it represents `None` case.

#### Present
Subclass for `Quantum`, it represents `Some` case.

#### Superposition
Alias for `Try` class in scala. Abstract class for standing for `Alive` and `Dead`.

#### Alive
Subclass for `Superposition`, it represents `Success` case.

#### Dead
Subclass for `Superposition`, it represents `Failure` case.
 
### Types
Class for type definition.

#### Function
Function type definitions.

#### JSONA
Asynchronous Class for serialization and deserialization `JSON`.

#### Kind
Type-determination class.

#### Value
Value type definitions.

### Others

#### UUID
Class for UUID.

#### Zeit
Class for Date and Time, using `dayjs`. 

#### Digest
Class for string hashing.

### Random
Class for random string, random number.

### TODO
+ [ ] `sequence.set()`
+ [ ] `sequence.remove()`
+ [ ] implements Time expiration function for `Cache`.

## License

[MIT](LICENSE)
