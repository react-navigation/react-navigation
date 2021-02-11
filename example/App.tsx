import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import { Assets } from '@react-navigation/elements';

import App from './src/index';

Asset.loadAsync(Assets);

registerRootComponent(App);
