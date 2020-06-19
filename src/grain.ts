const { Mutex } = require('await-semaphore');
import { GrainGenerator, Grain, Listener, Subscribe, RemoveListener, Unlock } from 'caputi';

const gen: GrainGenerator = function observable (value): Grain {
  let _value = value;
  const mutex = new Mutex();
  const listeners: Set<Listener> = new Set();

  const get = async () => {

    // I believe I do not need to use a mutex here
    // because the mutex only protects against updates.
    // This means reading should always be considered unsafe,
    // Since a write operation could be happening.

    // There may be value to a "safe read" method,
    // Which waits for any pending mutexes to complete
    // before returning a value, but on a busy machine,
    // the mutex queue may never end.
    return _value;
  };

  const set = async (value) => {

    // I believe I need to use a mutex here to ensure
    // that write attempts wait for any outstanding mutex
    const release = await mutex.acquire();
    try {
      unsafeUpdate(value);
    } catch (err) {
      await release();
      throw err;
    }

    await release();
    return _value;
  };

  function unsafeUpdate (value) {
    if (typeof value !== typeof _value) {
      throw new Error(`Value "${value}" is not of required type: ${typeof _value}`);
    }

    _value = value;
    for (let listener of listeners) {
      listener(_value);
    }

    return _value;
 }

  const subscribe: Subscribe = async (listener) => {
    if (typeof listener !== 'function') {
      throw new Error('Subscribe must receive a function as listener.')
    }
    listeners.add(listener);
    const remove: RemoveListener = async () => {
      listeners.delete(listener);
    }
    return remove;
  };

  const exclusiveSet = async (value) => {
    return unsafeUpdate(value);
  }

  const getExclusive = async () => {
    const release = await mutex.acquire();
    const unlock: Unlock = async () => {
      release();
      return getInexclusive();
    }

    return {
      get,
      set: exclusiveSet,
      subscribe,
      release: unlock,
    };
  }

  function getInexclusive () {
    const result: Grain = {
      get,
      set,
      subscribe,
      getExclusive,
    }
    return result;
  }

  return getInexclusive();
}

module.exports = gen;
