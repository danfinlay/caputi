import { GrainGenerator, GrainMapGenerator, CaptpWsClientGenerator, CaptpWsServerGenerator } from '../types';
import { readonly } from './grain/filters/read-only';

const grainMap: GrainMapGenerator = require('./grain-map.js');
const grain: GrainGenerator = require('./grain.ts');
const createServer: CaptpWsServerGenerator = require('./captp-ws-server.js');
const createClient: CaptpWsClientGenerator = require('./captp-ws-client.js');

export { grainMap, grain, createServer, createClient, readonly };

