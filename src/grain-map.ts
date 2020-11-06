const createGrain = require('./grain');
import { GrainMap, Grain, ExclusiveGrain } from '../types';



module.exports = function generateGrainMapGenerator (opts: {[key: string]: any}) {
  const grains = {};
  const mutex = {
    acquire: async () => {
      const grains = await getExclusiveGrainMap();
      return async () => {
        return await releaseAll(grains);
      }
    }
  }

  for (let name in opts) {
    const property = createGrain(opts[name]);
    grains[name] = property;
  }

  async function getExclusiveGrainMap(): Promise<{ [key:string]: ExclusiveGrain }> {
    const keys: string[] = Object.keys(grains);
    const grainArr: Function[] = await Promise.all(keys.map((key) => {
      return grains[key].getExclusive();
    }));
    const grainMap = {};
    for (let i = 0; i < grainArr.length; i++) {
      grainMap[keys[i]] = grainArr[i];
    }
    return grainMap;
  }

  async function getLocalMap(grainMap): Promise<{ [key:string]: any }> {
    const result = {};
    for (let key in grainMap) {
      result[key] = await grainMap[key].get();
    }
    return result;
  }

  const there = async (expression: string): Promise<Grain | ExclusiveGrain> => {
    const grainMap = await getExclusiveGrainMap();
    const values: { [key:string]: any } = await getLocalMap(grainMap);

    const compartment = new Compartment({});

    Object.keys(values).forEach((key) => {
      Reflect.defineProperty(compartment.globalThis, key, {
        get: () => values[key],
        set: (value) => {
          values[key] = value;
        },
      });
    })

    const instructions: string = `(function () {${expression}})();`
    let result: any = compartment.evaluate(instructions);

    if (typeof result === 'function') {
      result = createSafeFunction(result);
    }

    await assignValues(grainMap, values);
    await releaseAll(grainMap);
    return result;
  }

  async function assignValues (grainMap, values) {
    await Promise.all(Object.keys(grainMap).map((key) => {
      return grainMap[key].set(values[key]);
    }));
  }

  async function releaseAll (grains: { [key:string]: ExclusiveGrain}): Promise<void> {
    const promises: Promise<any>[] = [];
    for (let key in grains) {
      promises.push(grains[key].release());
    }
    await Promise.all(promises);
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
  
  const grainMap: GrainMap = {
    get: async (name) => {
      const val = await grains[name].get();
      return val;
    },

    set: async (name, value) => {
      if (grains[name]) {
        return grains[name].set(value);
      } else {
        grains[name] = createGrain(value);
        return grains[name].set(value);
      }
    },

    subscribe: async (name, listener) => {
      return grains[name].subscribe(listener);
    },

    lock: async (name) => {
      return grains[name].lock();
    },

    getGrain: async (name) => {
      return grains[name];
    },

    there,
  }
  return grainMap;
}
