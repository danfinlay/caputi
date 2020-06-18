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


function loadCount () {
  console.log('load count called');

  return E(getBootstrap()).get('count');
}
