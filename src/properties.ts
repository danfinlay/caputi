const createGrain = require('./grain');
import { Properties } from '../types';

module.exports = function generateProperties (opts: {[key: string]: any}) {
  const result = {};

  for (let name in opts) {
    const property = createGrain(opts[name]);
    result[name] = property;
  }

  const properties: Properties = {
    get: async (name) => {
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
  return properties;
}
