const { Mutex } = require('await-semaphore');
const equal = require('deep-equal');
import { GrainGenerator, Grain, There, Listener, Subscribe, RemoveListener, GetExclusive, Unlock, ExclusiveGrain } from '../types';
const ses = require('ses');

// To stop typescript from complaining about not using ses:
!!ses;

/// <reference types="./types/src/index.d.ts" />
lockdown({ mathTaming: 'unsafe' });

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

    // Don't notify listeners if no change is happening:
    if (equal(value, _value)) {
      return value;
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

  const there: There = async (expression: string): Promise<Grain | ExclusiveGrain> => {
    const release = await mutex.acquire();

    const compartment = new Compartment({});
    Reflect.defineProperty(compartment.globalThis, 'value', {
      get: () => _value,
      set: (value) => {
        unsafeUpdate(value);
      },
    });

    const instructions: string = `(function () {${expression}})();`
    let result: any = compartment.evaluate(instructions);

    if (typeof result === 'function') {
      result = createSafeFunction(result);
    }

    await release();
    return result;
  }

  function createSafeFunction (thereResult: Function) {
    return async (...args) => {
      const release = await mutex.acquire();
      let result = thereResult(...args);
      if (typeof result === 'function') {
        result = createSafeFunction(result);
      }
      await release();
      return result;
    }
  }

  const getExclusive: GetExclusive = async () => {
    const release = await mutex.acquire();
    const unlock: Unlock = async () => {
      release();
      return getInexclusive();
    }

    const grain: ExclusiveGrain = {
      get,
      set: exclusiveSet,
      subscribe,
      release: unlock,
      there,
    };
    return grain;
  }

  function getInexclusive () {
    const result: Grain = {
      get,
      set,
      subscribe,
      getExclusive,
      there,
    }
    return result;
  }

  return getInexclusive();
}

module.exports = gen;
