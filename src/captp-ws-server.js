const makeCapTpFromStream = require('captp-stream');

const http = require('http');
const websocket = require('websocket-stream')
const WebSocketServer = require('ws').Server

module.exports = function hostWsCapTpServerAtPort (bootstrap, port) {
  const server = http.createServer();
  const wss = new WebSocketServer({ server: server })

  server.listen(port, function() {
    const client = websocket('ws://localhost:' + port)

    wss.on('connection', function(ws) {
      const stream = websocket(ws, { objectMode: true })
      handle(stream, bootstrap);
    })
  });
}

function handle (stream, bootstrap) {
  const { abort } = makeCapTpFromStream('server', stream, bootstrap);
}

