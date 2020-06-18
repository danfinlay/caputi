import observable from '../src/observable';
import server from '../src/captp-ws-server';

function handle(stream, request) {
  // `request` is the upgrade request sent by the client.
  fs.createReadStream('bigdata.json').pipe(stream)
}function createCounter () {
  let count = observable(count, 'number'),
  return {
    count,
    // getters are synchronous locally, but can be converted before being passed to capTP:
    increment: async count => count.set(count.get() + 1),
  }
}

const counter = createCounter();

server(counter, 8088);

