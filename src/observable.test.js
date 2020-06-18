const test = require('tape');
const observable = require('./observable');

test('a simple number', (t) => {
  const obs = observable(0);
  t.ok('get' in obs);
  t.end();
});

test('.get()', async (t) => {
  const obs = observable(0);
  obs.get()
    .then((val) => {
      t.equals(val, 0);
      t.end();
    })
    .catch((reason) => {
      t.fail(reason);
      t.end();
    });
});

test('set', async (t) => {
  const obs = observable(0);
  obs.set(5)
    .then((val) => {
      t.equals(val, 5);
      t.end();
    })
    .catch((reason) => {
      t.fail(reason);
      t.end();
    });
});
