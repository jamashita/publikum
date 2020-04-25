# Publikum

Publikum (prononciation /puːblikʊm/) is a TypeScript library for me :))

## What is Publikum?

Publikum is the group of people who are at a play, concert, film, or a public meeting.

## Classes

### Objects
Object re-definition class for OOP programming.

#### Entity
Class for `Entity` for DDD.

#### Objet
Redefinition class for `Object`. Abstract class for `Nominative`.

### ValueObject
Class for `ValueObject` for DDD. 


### Collections
Collection classes that are totally wrapping `Array, Map, Set...` in order to data immutability.

#### Address
Alias for `Set`. Class for `Nominative` implemented classes.

#### Sequence
Alias for `Array`. Class for `Nominative` implemented classes.


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
Alias for `Optional` for scala. Abstract class for representing `Some` or` None`.

#### Absent
Subclass for `Quantum`, it represents `None` case.

#### Present
Subclass for `Quantum`, it represents `Some` case.

#### Superposition
Alias for `Try` class in scala. Abstract class for representing `Success` or `Failure`.

#### Alive
Subclass for `Superposition`, it represents `Success` case.

#### Dead
Subclass for `Superposition`, it represents `Failure` case.
 

### Types
Class for type definition.

#### Function
Function type definitions.

#### JSONA
Asynchronous Class for `JSON.parse()` and `JSON.stringify()`.

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
[] `sequence.set()`
[] `sequence.remove()`
[] implements Time expiration function for `Cache`.

## License

[MIT](LICENSE)
