import { TurboModuleRegistry } from 'react-native';

import type { Spec } from './types';

export default TurboModuleRegistry.getEnforcing<Spec>('RNSourcepointCmp');
