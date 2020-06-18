const test = require('tape');
const generateProperties = require('./properties');

test('a simple number', (t) => {
  const obs = generateProperties({
    count: 0,
  });
  t.ok('get' in obs);
  t.end();
});

test('get()', async (t) => {
  const obs = generateProperties({
    count: 0,
  });

  const val = await obs.get('count');
  console.dir(val)
  t.equals(val, 0);
  t.end();
});

test('set()', async (t) => {
  const obs = generateProperties({
    count: 0,
  });

  t.ok('set' in obs);
  const val = await obs.set('count', 5);
  console.dir(val)
  t.equals(val, 5);
  t.end();
});
