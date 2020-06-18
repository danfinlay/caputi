const makeCapTpFromStream = require('captp-stream');
const ndjson = require('ndjson');
const pipeline = require('pumpify');
const harden = require('@agoric/harden');
const inspect = require('inspect-stream');

const http = require('http');
const websocket = require('websocket-stream')
const WebSocketServer = require('ws').Server

module.exports = function hostWsCapTpServerAtPort (bootstrap, port) {
  const server = http.createServer();
  const wss = new WebSocketServer({
    server: server,
  });

  server.listen(port, function() {
    wss.on('connection', function(ws) {
      console.log('New connection!', ws);
      const stream = websocket(ws, { objectMode: true });
      handle(stream, bootstrap);
    })
  });
}

function handle (ws, bootstrap) {
  const stream = pipeline.obj(ndjson.serialize(), inspect(), ws, inspect(), ndjson.parse());
  const { abort } = makeCapTpFromStream('server', stream, harden(bootstrap));
}
