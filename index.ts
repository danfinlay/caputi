import { PropertyGenerator, ObservableGenerator, CaptpWsClientGenerator, CaptpWsServerGenerator } from './types';

const generateProperties: PropertyGenerator = require('./src/properties.js');
const observable: ObservableGenerator = require('./src/observable.ts');
const captpWsServer: CaptpWsServerGenerator = require('./src/captp-ws-server.js');
const captpWsClient: CaptpWsClientGenerator = require('./src/captp-ws-client.js');

export { generateProperties, observable, captpWsClient, captpWsServer };
