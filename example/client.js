const client = require('../src/captp-ws-client');

const { E, getBootstrap } = client('ws://localhost:8088');

console.log('loading count')

loadCount()
.then((count) => {
  console.log(`The count is ${count}!`);
  debugger;
})
.catch((reason) => {
  console.error('problem!', reason);
  debugger;
})


async function loadCount () {
  console.log('load count called');
  const boot = getBootstrap();
  const getter = E.G(boot);
  const count = getter.count;
  const caller = E(count);
  const called = caller.get();
  const num = await called;
  return num

  return E(E.G(getBootstrap()).count).get();
}

