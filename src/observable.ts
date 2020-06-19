const { Mutex } = require('await-semaphore');
import { Observable, Listener, Subscribe, RemoveListener, Lock, Unlock } from '../types';

module.exports = function observable (value): Observable {
  let _value = value;
  const mutex = new Mutex();
  const listeners: Set<Listener> = new Set();
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

  const lock: Lock = async () => {
    const release = await mutex.acquire();
    const unlock: Unlock = async () => {
      release();
      return _value;
    }
    return unlock;
  }

  const result: Observable = {
    get,
    set,
    subscribe,
    lock,
  }

  return result;
}
