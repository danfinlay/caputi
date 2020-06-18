const { Mutex } = require('await-semaphore')

export function observable (value, typeInfo) {
  let _value = value;
  const mutex = new Mutex();
  const listeners = new Set();

  return {

    get: async () => {
      return _value;
    },

    set: (value) => {

      if (typeInfo) {
        // For now, simple type checking, but later could support enforcing JSON-schema or something!
        if (typeof value !== typeInfo) {
          throw new Error(`Value "${value}" is not of required type: ${typeInfo}`);
        }
      }

      _value = value;

      for (let listener of listeners) {
        listener(_value);
      }
    },

    subscribe: async (listener) => {
      if (typeof listener !== 'function') {
        throw new Error('Subscribe must receive a function as listener.')
      }
      listeners.add(listener);
      return async unsubscribe () => {
        listeners.remove(listener);
      }
    },

    lock: async () => {
      const release = await mutex.acquire();
      return async () => {
        release();
        return _value;
      }
    }
  }
}

