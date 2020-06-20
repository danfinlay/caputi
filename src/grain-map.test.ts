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
  console.dir(val)
  t.equals(val, 0);
  t.end();
});

test('set()', async (t) => {
  const grainMap = createGrainMap({
    count: 0,
  });

  t.ok('set' in grainMap);
  const val = await grainMap.set('count', 5);
  console.dir(val)
  t.equals(val, 5);
  t.end();
});
