const makeCapTpFromStream = require('captp-stream');
const websocket = require('websocket-stream');
const pipeline = require('pumpify');
const ndjson = require('ndjson');
const harden = require('@agoric/harden');

module.exports = function connectToAddress (address) {
  const ws = websocket(address, {
    binary: false,
    objectMode: true,
  });

  const stream = pipeline.obj(ndjson.serialize(), ws, ndjson.parse());

  return makeCapTpFromStream('server', stream, harden({}));
}
