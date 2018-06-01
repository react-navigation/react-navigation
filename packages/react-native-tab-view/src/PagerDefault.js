/* @flow */

import { Platform } from 'react-native';

let Pager;

switch (Platform.OS) {
  case 'android':
    Pager = require('./PagerAndroid').default;
    break;
  case 'ios':
    Pager = require('./PagerScroll').default;
    break;
  default:
    Pager = require('./PagerPan').default;
    break;
}

export default Pager;
