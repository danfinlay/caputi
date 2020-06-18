const { Mutex } = require('await-semaphore')

export function observable (value, typeInfo) {
  let _value = value;
  const mutex = new Mutex();

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

