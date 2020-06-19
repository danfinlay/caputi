const observable = require('./observable');

module.exports = function generateProperties (properties) {
  const result = {};

  for (let name in properties) {
    const property = observable(properties[name]);
    result[name] = property;
  }

  return {
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
}
