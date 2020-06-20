const createGrain = require('./grain');
import test from 'tape';

test('a simple number', (t) => {
  const grain = createGrain(0);
  t.ok('get' in grain);
  t.end();
});

test('an object', async (t) => {
  const grain = createGrain({ foo: 'bar' });
  await grain.set({ foo: 'baz' });
  const res = await grain.get();
  t.equals(res.foo, 'baz');
  t.end();
})

test('.get()', async (t) => {
  const grain = createGrain(0);
  grain.get()
    .then((val) => {
      t.equals(val, 0, 'starts as 0');
      t.end();
    })
    .catch((reason) => {
      t.fail(reason);
      t.end();
    });
});

test('set', (t) => {
  const grain = createGrain(0);
  grain.set(5)
    .then((val) => {
      t.equals(val, 5, 'set to 5');
      t.end();
    })
    .catch((reason) => {
      t.fail(reason);
      t.end();
    });
});

test('subscribe', async (t) => {
  const grain = createGrain(0);

  let pass = 1;
  const unsubscribe = await grain.subscribe(async (val) => {
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

  try {
    await grain.set(5)
    await grain.set(12)
  } catch (err) {
    t.fail(err);
    t.end();
  }
});

test('getExclusive()', { timeout: 1000 }, (t) => {
  const grain = createGrain(2);

  grain.getExclusive()
  .then(async (exclusive) => {
    const latest: number = await exclusive.get();
    await exclusive.set(latest * 2);
    await exclusive.release();
  });

  grain.getExclusive()
  .then(async (exclusive) => {
    const latest: number = await exclusive.get();
    await exclusive.set(latest * 2);
    await exclusive.release();
  });
 
  let pass = 1;
  grain.subscribe(async (val) => {
    switch (pass) {
      case 1:
        pass++;
        t.equals(val, 4, 'first pass should double to 4');
        break;
      case 2:
        pass++;
        t.equals(val, 8, 'second pass should double to 8');
        t.end();
        break;
      default:
        t.fail();
        t.end();
        break;
    }
  })
 
});

test('.there()', async (t) => {
  const grain = createGrain(2);
  try {

    await grain.there(`value * 2`);
    await grain.there(`value * 2`);

    const result = await grain.get();
    t.equal(result, 8, 'should have doubled twice.');
    t.end();

  } catch (err) {
    t.fail(err);
    t.end();
  }
});

test('.there() concurrency', (t) => {
  const grain = createGrain(2);

  grain.there(`value * 2`)
  .catch((err) => {
    t.fail(err);
    t.end();
  });

  grain.there(`value * 2`)
  .catch((err) => {
    t.fail(err);
    t.end();
  });

  let pass = 1;
  grain.subscribe(async (val) => {
    switch (pass) {
      case 1:
        pass++;
        t.equals(val, 4, 'first pass should double to 4');
        break;
      case 2:
        pass++;
        t.equals(val, 8, 'second pass should double to 8');
        t.end();
        break;
      default:
        t.fail();
        t.end();
        break;
    }
  })
});

