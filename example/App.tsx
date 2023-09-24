import 'react-native-gesture-handler';

import { Assets } from '@react-navigation/elements';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';

import { App } from './src/index';
import { LinkingPlayground } from './src/LinkingPlayground';

const LINKING_EXAMPLE = false;

Asset.loadAsync(Assets);

registerRootComponent(LINKING_EXAMPLE ? LinkingPlayground : App);
