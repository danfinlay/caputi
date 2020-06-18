import observable from '../src/observable';
import server from '../src/captp-ws-server';

function createCounter () {
  let count = observable(count, 'number'),
  return {
    count,
    // getters are synchronous locally, but can be converted before being passed to capTP:
    increment: async () => count.set(count.get() + 1),
  }
}

const counter = createCounter();

server(counter, 8088);

