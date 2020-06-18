const generateProperties = require('../src/properties');
const server = require('../src/captp-ws-server');

function createCounter () {
  const properties = generateProperties({
    count: 0,
  });

  console.log('properties generated: ', properties)

  return {
    ...properties,
    // getters are synchronous locally, but can be converted before being passed to capTP:
    increment: async () => {
      return properties.set('count', await properties.get('count') + 1);
    }
  }
}

const counter = createCounter();

server(counter, 8088);
