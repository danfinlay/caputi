const client = require('../src/captp-ws-client');

const { E, getBootstrap } = client('ws://localhost:8088');

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
  return E(E(E(getBootstrap()).count).get())
}

