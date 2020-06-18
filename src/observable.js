const { Mutex } = require('await-semaphore');

module.exports = function observable (value) {
  let _value = value;
  const mutex = new Mutex();
  const listeners = new Set();
  const get = async () => {
    return _value;
  };

  const set = async (value) => {
    if (typeof value !== typeof _value) {
      throw new Error(`Value "${value}" is not of required type: ${typeof _value}`);
    }

    _value = value;

    for (let listener of listeners) {
      listener(_value);
    }

    return _value;
  };

  const subscribe = async (listener) => {
    if (typeof listener !== 'function') {
      throw new Error('Subscribe must receive a function as listener.')
    }
    listeners.add(listener);
    return async () => {
      listeners.remove(listener);
    }
  };

  const lock = async () => {
    const release = await mutex.acquire();
    return async () => {
      release();
      return _value;
    }
  }

  const result = {
    get,
    set,
    subscribe,
    lock,
  }

  return result;
}
