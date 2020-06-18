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
  return E(E.G(getBootstrap()).count).get();
}

