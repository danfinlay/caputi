# Caputi

![Caputo from Orange is the New Black. Mostly because of the name, but if you think about it, he's the guy tasked with keeping a jail operating smoothly.](./caputo.jpg)

A UI and development framework for CapTP.

An experiment in building some web tools around efficiently building applications that are friendly to easily render over a `capTP` interface!

Based on [some notes here](https://roamresearch.com/#/app/danfinlay/page/1xxtcDrhI).

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
