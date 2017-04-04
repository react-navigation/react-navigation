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

const TransitionView = createTransitionComponent(View); 
const TransitionImage = createTransitionComponent(Image); 
const TransitionText = createTransitionComponent(Text); 

function withType(type: string, C) {
  return props => <C {...props} type={type} />;
}

export default {
  View: TransitionView,
  Image: TransitionImage,
  Text: TransitionText,
  createTransitionComponent,
  createTransition,
  bindTransition,
  together,
  sequence,
  tg,
  sq,
  Transitions,
  SharedElement: {
    View: withType('sharedElement', TransitionView),
    Image: withType('sharedElement', TransitionImage),
    Text: withType('sharedElement', TransitionView),
    create: (C) => withType('sharedElement', createTransitionComponent(C)),
  },
}