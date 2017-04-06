import React from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';
import TransitionItems from './TransitionItems';
import createTransitionComponent from './createTransitionComponent';
import { createTransition, bindTransition } from './transitionHelpers';
import { together, sequence, tg, sq } from './composition';
import Transitions from './Transitions';

function withType(type: string, C) {
  return props => <C {...props} type={type} />;
}

function createSharedElementComponent(C) {
  return withType('sharedElement', createTransitionComponent(C));
}

export default {
  View: createTransitionComponent(View),
  Image: createTransitionComponent(Image),
  Text: createTransitionComponent(Text),
  createTransitionComponent,
  createTransition,
  bindTransition,
  together,
  sequence,
  tg,
  sq,
  Transitions,
  SharedElement: {
    View: createSharedElementComponent(View),
    Image: createSharedElementComponent(Image),
    Text: createSharedElementComponent(Text),
    createComponent: createSharedElementComponent,
  },
}