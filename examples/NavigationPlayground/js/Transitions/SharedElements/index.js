import {
  StackNavigator,
} from 'react-navigation';

import PhotoGrid from './PhotoGrid';
import PhotoDetail from './PhotoDetail';
import { Transition } from 'react-navigation';
import _ from 'lodash';
import faker from 'faker';

const {createTransition, initTransition, together, sq, Transitions} = Transition;

const Slide = createTransition({
  getStyleMap(
    itemsOnFromRoute: Array<*>, 
    itemsOnToRoute: Array<*>, 
    transitionOptions,
  ) {
    // direction is 1 or -1
    const { direction, layout: {initWidth} } = transitionOptions;
    const routeToSlide = direction > 0 ? 'to' : 'from';
    const itemsToSlide = direction > 0 ? itemsOnToRoute : itemsOnFromRoute;
    const slide = (result, item) => {
      result[item.id] = {
        translateX: {
          // inputRange: [0, 1] /// ===> [position, nextPosition]
          outputRange: (direction > 0
            ? [initWidth, 0]
            : [0, initWidth]
          )
        }
      }
      return result;
    }
    return {
      [routeToSlide]: itemsToSlide.reduce(slide, {}),
    }
  } 
});

const SharedImage = initTransition(Transitions.SharedElement, /image-.+/);
const CrossFadeScene = initTransition(Transitions.CrossFade, /\$scene.+/);
const SlideScene = initTransition(Slide, /\$scene.+/);

const StaggeredAppear = (filter) => ({
  filter,
  getStyleMap(
    itemsOnFromRoute: Array<*>, 
    itemsOnToRoute: Array<*>, 
    transitionProps) {
    const createStyle = (startTime, axis, direction) => {
      const {progress} = transitionProps;
      const inputRange = [0, startTime, 1];
      const opacity = progress.interpolate({
        inputRange,
        outputRange:  [0, 0, 1],
      });
      const translate = progress.interpolate({
        inputRange,
        outputRange: [ direction * 400, direction * 400, 0],
      });
      axis = axis === 'x' ? 'translateX' : 'translateY';
      return {
        opacity,
        transform: [ { [axis]: translate } ],
      };
    }
    const clamp = (x, min, max) => Math.max(min, Math.min(max, x));
    const axes = ['x', 'y'];
    const directions = [-1, 1];
    return {
      to: itemsOnToRoute.reduce((result, item) => {
        const startTime = clamp(Math.random(), 0.1, 0.9);
        const axis = faker.random.arrayElement(axes);
        const direction = faker.random.arrayElement(directions);
        result[item.id] = createStyle(startTime, axis, direction);
        return result;
      }, {}),
    };
  }
})

// const StaggeredAppearImages = createTransition(StaggeredAppear, /image-.+/);

const NoOp = (filter) => ({
  filter,
  getStyleMap() {
    console.log('NoOp transition called');
  }
});
const NoOpImage = createTransition(NoOp, /image-.+/);

const transitions = [
  // { from: 'PhotoGrid', to: 'PhotoDetail', transition: CrossFadeScene(1) },
  // { from: 'PhotoDetail', to: 'PhotoGrid', transition: CrossFadeScene(1) },
  // { from: 'PhotoGrid', to: 'PhotoDetail', transition: NoOpImage},
  // { from: 'PhotoDetail', to: 'PhotoGrid', transition: NoOpImage},
  // { from: 'PhotoGrid', to: 'PhotoDetail', transition: together(SharedImage, DelayedFadeInDetail)},
  // { from: 'PhotoDetail', to: 'PhotoGrid', transition: together(SharedImage, FastFadeOutDetail) },
  // { from: 'PhotoGrid', to: 'PhotoDetail', transition: DelayedFadeInDetail},
  // { from: 'PhotoDetail', to: 'PhotoGrid', transition: FastFadeOutDetail },
  // { from: 'PhotoGrid', to: 'PhotoDetail', transition: SharedImage(1)},
  // { from: 'PhotoDetail', to: 'PhotoGrid', transition: SharedImage(1)},
  // { from: 'PhotoGrid', to: 'PhotoDetail', transition: CrossFadeScene },
  // { from: 'PhotoDetail', to: 'PhotoGrid', transition: together(StaggeredAppearImages, SlideScenes) },
  // { from: 'PhotoGrid', to: 'PhotoDetail', transition: together(SharedImage(), sq(Idle(0.9), CrossFadeScene()))},
  // { from: 'PhotoDetail', to: 'PhotoGrid', transition: together(CrossFadeScene(0.1), SharedImage())},
  { from: 'PhotoGrid', to: 'PhotoDetail', transition: sq(SharedImage(0.9), CrossFadeScene(0.1)), config: {duration: 650}},
  { from: 'PhotoDetail', to: 'PhotoGrid', transition: sq(CrossFadeScene(0.1), SharedImage(0.9)), config: {duration: 650}},
];

const App = StackNavigator({
  PhotoGrid: {
    screen: PhotoGrid,
  },
  PhotoDetail: {
    screen: PhotoDetail,
  }
}, {
    transitions,
  });

export default App;