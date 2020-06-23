import { GrainGenerator, GrainMapGenerator } from '../types';
import { readonly } from './grain/filters/read-only';
const grainMap: GrainMapGenerator = require('./grain-map');
const grain: GrainGenerator = require('./grain/index');

export { grainMap, grain, readonly };

