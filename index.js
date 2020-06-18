const generateProperties = require('./src/properties.js');
const observable = require('./src/observable.js');
const captpWsServer = require('./src/captp-ws-server.js');
const captpWsClient = require('./src/captp-ws-client.js');

module.exports = {
  generateProperties,
  observable,
  captpWsClient,
  captpWsServer,
};
