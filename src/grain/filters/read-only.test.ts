import test from 'tape';
const createGrain = require('../');
const readonly = require('./read-only');

test('removing writable properties', (t) => {
    const grain = createGrain({ hello: 'world!' });
    const restricted = readonly(grain);

    t.notOk('write' in restricted);
    t.notOk('there' in restricted);
    t.notOk('getExclusive' in restricted);
    t.end();
});
