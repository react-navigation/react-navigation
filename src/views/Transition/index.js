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
}