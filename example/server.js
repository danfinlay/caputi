const observable = require('../src/observable');
const server = require('../src/captp-ws-server');

function createCounter () {
  let count = observable(0, 'number');
  return {
    count,
    // getters are synchronous locally, but can be converted before being passed to capTP:
    increment: async () => count.set(count.get() + 1),
  }
}

const counter = createCounter();

server(counter, 8088);

