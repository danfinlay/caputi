import { ReadOnlyGrain, Grain } from '../../../types';

function readonly (writable: Grain): ReadOnlyGrain {
    const result: ReadOnlyGrain = {
        get: writable.get,
        subscribe: writable.get,
    };
    return result;
}

module.exports = readonly;