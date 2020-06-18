const makeCapTpFromStream = require('captp-stream');
const websocket = require('websocket-stream');

module.exports = function connectToAddress (address) {
  const ws = websocket(address, {
    binary: false,
    objectMode: true,
  });

  return makeCapTpFromStream('server', ws, {});
}
