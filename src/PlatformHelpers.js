// Copied from PlatformHelpers.web.js.

// This file will get overridden for React Native by the .native.js file, while packagers
// like webpack will look here, because they do not prioritize .web.js files by default.

import React from 'react';
import { BackHandler, View } from 'react-native';

const MaskedViewIOS = () => <View>{this.props.children}</View>;

export { BackHandler, MaskedViewIOS };
