const observable = require('./observable');
import test from 'tape';

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

test('subscribe', async (t) => {
  const obs = observable(0);

  let pass = 1;
  const unsubscribe = await obs.subscribe(async (val) => {
    switch (pass) {
      case 1:
        pass++;
        t.equals(val, 5);
        break;
      case 2:
        pass++;
        t.equals(val, 12);
        await unsubscribe();
        t.end();
        break;
      default:
        t.fail();
        await unsubscribe();
        t.end();
        break;
    }
  })

  obs.set(5)
    .catch((reason) => {
      t.fail(reason);
      t.end();
    });

  obs.set(12)
    .catch((reason) => {
      t.fail(reason);
      t.end();
    });

});


