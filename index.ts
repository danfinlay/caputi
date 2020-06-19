import { GrainGenerator, PropertyGenerator, CaptpWsClientGenerator, CaptpWsServerGenerator } from './types';

const generateProperties: PropertyGenerator = require('./src/properties.js');
const grain: GrainGenerator = require('./src/grain.ts');
const captpWsServer: CaptpWsServerGenerator = require('./src/captp-ws-server.js');
const captpWsClient: CaptpWsClientGenerator = require('./src/captp-ws-client.js');

export { generateProperties, grain, captpWsClient, captpWsServer };
