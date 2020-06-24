# Caputi

![Splash image: Caputo from Orange is the New Black. Mostly because of the name, but if you think about it, he's the guy tasked with keeping a jail operating smoothly.](./caputo.jpg)

A development framework for [CapTP](https://github.com/Agoric/agoric-sdk/tree/master/packages/captp), based on [some notes here](https://roamresearch.com/#/app/danfinlay/page/1xxtcDrhI).

Status: Unstable, active development, much documentation is probably missing, but decent TS so it might be usable for fun.

Should be convenient to use with my related modules: [captp-stream](https://github.com/danfinlay/captp-stream) (features a nice CapTP intro in its readme) or [node websocket captp](https://github.com/danfinlay/node-ws-captp).

## Installation

`npm i caputi -S` or `yarn add caputi`.

## Introduction

CapTP makes it easy to share a JavaScript interface between processes or JS environments (like client and server). However, it has some very specific constraints around how its objects must be formed, like: All objects must EITHER have only functions as values, OR be JSON-serializable.

CapTP is intended to enable [secure distributed programming with object capabilities](https://www.youtube.com/watch?v=w9hHHvhZ_HY&t=2s), but in order to realize this language-level [object-capability](https://en.wikipedia.org/wiki/Object-capability_model) security across network partitions, it is critical that developers get comfortable using CapTP-friendly objects first-hand.

I might speculate that long term many of the benefits of [SES](https://github.com/Agoric/ses-shim) can only be realized if developers embrace a paradigm of highly async-first programming as a first-class model framework. And that's what `Caputi` is intended to explore.

In Caputi, any value that you might want to make available over the network to any number of users should be wrapped in a `grain()` (language complements of [Sandstorm](https://docs.sandstorm.io/en/latest/developing/powerbox/)).

A `grain` is a CapTP-friendly wrapper for any simple value that may need to be updated atomically, and might be a source of write conflicts.

```javascript
const { grain } = require('caputi');

const name = grain('Dan');

const check = await name.get();
assert.equals(check, name);

const update = await name.set('Daniel');
// Updated!

const exclusive = await name.getExclusive();
const old = await exclusive.get();
await exclusive.set(old + '!!!');
await exclusive.release();
```

As you can see, a simple JS value of any type becomes an object with pretty standard async getters and setters, and a notion of "exclusive" locks for writes that depend on current values, like an increment function.

This pattern is designed to make it easy to share access or partial access to a value with others, either other modules in the same context, or other agents over a CapTP partition. For example, caputi also ships with a simple `readonly` function that accepts a grain and returns a read-only version of that grain:

```javascript
const { grain, readonly } = require('caputi');

const name = grain('Dan');
const readable = readonly(name);

await readable.write('Bob');
// Error: write is not found on this object.
```
Caputi also exports a `readonlyGrainMap` function for attenuating a `GrainMap`.

Additionally, I've included a `.there()` function, a concept described to me by Mark Miller, which allows the consumer to write a fully synchronous snippet of code that will be executed in the object's environment:

```javascript
const { grain } = require('caputi');

const name = grain('Dan');
await name.there(`value = value + '!!!'`);
// Name is now "Dan!!!", in a single safe operation!;
```
I've also included a class called a `grainMap`, which is a map of grains, and whose `there` function makes all of its values synchronously available for read and update.

```javascript
const { grainMap } = require('caputi');

const map = grainMap({
  counter: 0,
  foo: 'bar',
});

await map.set('counter', 1);
await map.there(`counter = 2; foo = 'baz' + counter;`);
```

## Long Term Vision

Lots of developers seem [terrified of async programming](https://www.kialo.com/the-best-blockchains-of-the-future-will-embrace-asynchronous-inter-contract-communication-32530), even though it seems inevitable to me.

I think one of the things that developers really want is the comfort and ergonomics of synchronous programming.

I'd love to see a framework like this extend to supporting a multi-host environment, where a `there()` function could accept grains from multiple servers, unwrap them into a synchronously locked environment, and allow the most vanilla synchronous looking JS to be written to coordinate multiple dynamic systems.

```javascript
const blogPost = await server1.getPost();
const author = await server2.getAuthor();

await caputi.there({ blogPost, author }, `blogPost += 'A special thanks to ' + author.name + 'for their contributions!'`);
```

## Components of note

[grain](./src/grain.js) is a JavaScript function that takes a given value and returns an object that can be consumed as an interface over capTP.

```typescript
interface Grain <T> {
  set: async (newValue) => Grain;
  get: async () => <T>;

  // Takes a listener function as argument, returns an unsubscribe function.
  subscribe: async(async (updated: <T>) => {}) => async () => {};

  // A semaphore is available for all grain values!
  getExclusive: async () => async () => ExclusiveGrain;

  // I'll get to this later...
  there: ThereFunction;
}
```
An exclusive grain is just like a normal one, except it has a `release()` function instead of `getExclusive()`, and you can be sure that nothing will change the value except you until you release it.

Only the `set` method on the `ExclusiveGrain` works until all outstanding `ExclusiveGrain` instances have called `release()`.

The `ThereFunction` lets you call atomic operations on the remote value, like this:

```javascript
const grain = createGrain(1);
await grain.there(`value * 2`);
```
The result of this expression is assigned as the new value for the `grain`.

Rather than needing to use the `getExclusive()` operator to perform this synchronous operation, the `there` function performs the requested operation atomically within the synchronous context of the grain's own value.

Caputi grains are designed so that they can easily be serialized over a network boundary using CapTP. That means both local and remote usage of Caputi Grains make for a nearly identical developer experience! No REST, JSON-RPC, or GraphQL, just pure native JS on both sides of the boundary.

```javascript

function createCounter () {
  let count = grain(count, 'number'),
  return {
    count,
    // getters are synchronous locally, but can be converted before being passed to capTP:
    increment: async () => count.set(count.get() + 1),
  }
}

const counter = createCounter();

// We can now expose `counter` as a `bootstrap` to `capTP`.
server(counter, 8088);
```

This can allow safe async operations on the remote value when transmitted over capTP, like this:
```
const release = await counter~.lock();
const value = await counter~.get();
await counter~.set(value + 1);
await release();
```

Anyways, this is early days, but I'm trying to get some basic tools set up for not just trying this out once but iterating on the method in general, so this repo includes:

- A capTP weboscket server
- a capTP websocket client
- The grain method listed above

Hopefully it will grow to include:

- Some front-end tools for generating responsive UI elements based on capTP presences!

## Running The Example

You may want to re-build the client code with `browserify example/client.js -o example/bundle.js`.

You then should run an http server at the root, like `http-server`.

You will also need to run the server, so run `node example/server.js`.

Then visit whatever port the `http-server` is hosting the client page at.

Currently the example isn't quite working, I am pretty sure I'm mis-using the Eventual-Get method or something.
