const { Mutex } = require('await-semaphore');
const observable = require('./observable');

module.exports = function generateProperties (properties) {
  const result = {};

  for (let name in properties) {
    const property = observable(properties[name]);
    console.log(`generated observable ${name}: ${JSON.stringify(property)}`)
    console.log('from value of ', properties[name])
    result[name] = property;
  }

  return {
    get: async (name) => {
      console.log(`Attempting to GET ${name} from ${JSON.stringify(result)}`)
      return result[name].get();
    },

    set: async (name, value) => {
      return result[name].set(value);
    },

    subscribe: async (name, listener) => {
      return result[name].subscribe(listener);
    },

    lock: async (name) => {
      return result[name].lock();
    }
  }
}
