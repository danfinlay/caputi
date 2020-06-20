const createGrainMap = require('./grain-map');
import test from 'tape';

test('a simple number', (t) => {
  const grainMap = createGrainMap({
    count: 0,
  });
  t.ok('get' in grainMap);
  t.end();
});

test('get()', async (t) => {
  const grainMap = createGrainMap({
    count: 0,
  });

  const val = await grainMap.get('count');
  t.equals(val, 0);
  t.end();
});

test('set()', async (t) => {
  const grainMap = createGrainMap({
    count: 0,
  });

  t.ok('set' in grainMap);
  const val = await grainMap.set('count', 5);
  t.equals(val, 5);
  t.end();
});

test('there()', async (t) => {
  const grainMap = createGrainMap({
    count: 0,
    name: 'Bobo',
  });

  await grainMap.there('name = name + count');
  const result = await grainMap.get('name');
  t.equals(result, 'Bobo0', 'should have appended a zero');
  t.end();
});

