# Caputi

![Caputo from Orange is the New Black. Mostly because of the name, but if you think about it, he's the guy tasked with keeping a jail operating smoothly.](./caputo.jpg)

A UI and development framework for CapTP.

An experiment in building some web tools around efficiently building applications that are friendly to easily render over a `capTP` interface!

Based on [some notes here](https://roamresearch.com/#/app/danfinlay/page/1xxtcDrhI).

## Components of note

[observable](./src/observable.js) is a JavaScript function that takes a given value and returns an object that can be consumed as an interface over capTP.

```typescript
interface Observable <T> {
  set: async (newValue) => Observable;
  get: async () => <T>;

  // Takes a listener function as argument, returns an unsubscribe function.
  subscribe: async(async (updated: <T>) => {}) => async () => {};

  // A semaphore is available for all observable values!
  lock: async () => async () => Observable;
}
```
This allows a simple construction of objects by simply wrapping any values they need to manage with a call to `observable(value: any, type?: string)`.

```javascript

function createCounter () {
  let count = observable(count, 'number'),
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
- The observable method listed above

Hopefully it will grow to include:

- Some front-end tools for generating responsive UI elements based on capTP presences!

## Running The Example

You may want to re-build the client code with `browserify example/client.js -o example/bundle.js`.

You then should run an http server at the root, like `http-server`.

You will also need to run the server, so run `node example/server.js`.

Then visit whatever port the `http-server` is hosting the client page at.

Currently the example isn't quite working, I am pretty sure I'm mis-using the Eventual-Get method or something.
