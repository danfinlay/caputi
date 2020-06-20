import { GrainGenerator, GrainMapGenerator, CaptpWsClientGenerator, CaptpWsServerGenerator } from './types';
import readonly from './src/grain/types/readonly';

const grainMap: GrainMapGenerator = require('./src/grain-map.js');
const grain: GrainGenerator = require('./src/grain.ts');
const createServer: CaptpWsServerGenerator = require('./src/captp-ws-server.js');
const createClient: CaptpWsClientGenerator = require('./src/captp-ws-client.js');

export { grainMap, grain, createServer, createClient, readonly };

