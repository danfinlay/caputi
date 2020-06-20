import test from 'tape';
const createGrain = require('../');
const createGrainMap = require('../../grain-map');
const { readonly, readonlyGrainMap }= require('./read-only');

test('removing writable properties', (t) => {
    const grain = createGrain({ hello: 'world!' });
    const restricted = readonly(grain);

    t.notOk('write' in restricted);
    t.notOk('there' in restricted);
    t.notOk('getExclusive' in restricted);
    t.end();
});

test('readonlyGrainMap: removing writable properties', (t) => {
    const grainMap = createGrainMap({ hello: 'world!' });
    const restricted = readonlyGrainMap(grainMap);

    t.notOk('write' in restricted);
    t.notOk('there' in restricted);
    t.notOk('getExclusive' in restricted);
    t.end();
});
