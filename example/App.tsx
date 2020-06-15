import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import { Assets as StackAssets } from '@react-navigation/stack';

import App from './src/index';

Asset.loadAsync(StackAssets);

registerRootComponent(App);
