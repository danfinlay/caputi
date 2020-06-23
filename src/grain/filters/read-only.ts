import { ReadOnlyGrain, Grain, GrainMap, ReadOnlyGrainMap } from '../../../types';

export function readonly (writable: Grain): ReadOnlyGrain {
    const result: ReadOnlyGrain = {
        get: writable.get,
        subscribe: writable.get,
    };
    return result;
}

export function readonlyGrainMap (writable: GrainMap): ReadOnlyGrainMap {
    const {
        get,
        subscribe,
    } = writable;

    return {
        get,
        subscribe,
        getGrain: async (key: string) => {
            const grain = await writable.getGrain(key);
            return readonly(grain);
        }
    };
}
