import {
  StackNavigator,
} from 'react-navigation';

import PhotoGrid from './PhotoGrid';
import PhotoDetail from './PhotoDetail';
import PhotoMoreDetail from './PhotoMoreDetail';
import { Transition } from 'react-navigation';
import _ from 'lodash';
import faker from 'faker';

const App = StackNavigator({
  PhotoGrid: {
    screen: PhotoGrid,
  },
  PhotoDetail: {
    screen: PhotoDetail,
  },
  PhotoMoreDetail: {
    screen: PhotoMoreDetail,
  }
});

export default App;