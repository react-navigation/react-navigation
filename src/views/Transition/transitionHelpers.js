// @flow
import invariant from 'invariant';
import _ from 'lodash';
import type {
  TransitionStyleMap,
  UnboundTransition,
  BoundTransition,
  TransitionConfig,
  TransitionFilter,
  GetTransitionStyleMap,
} from '../../TypeDefinition';

type IdOrRegex = string | RegExp;

function createIdRegexFilter(idOrRegexes: Array<IdOrRegex>): TransitionFilter {
  return (id: string) => idOrRegexes.some(idOrRegex => (
    _.isRegExp(idOrRegex) ? id.match(idOrRegex) : id === idOrRegex
  ));
}

export function bindTransition(unboundTransition: UnboundTransition, ...idOrRegexes: Array<IdOrRegex>): BoundTransition {
  return unboundTransition && unboundTransition(createIdRegexFilter(idOrRegexes));
}

const isTransformProp = (prop: string): boolean => (
  ['perspective', 'rotate', 'rotateX', 'rotateY', 'rotateZ',
    'scale', 'scaleX', 'scaleY', 'translateX', 'translateY', 'skewX', 'skewY'].includes(prop)
);

const mergeTransform = (transforms: ?Array<*>, prop: string, value: Object) => {
  const array = transforms || [];
  const index = array.findIndex(t => !_.isNil(t[prop]));
  if (index >= 0) array[index][prop] = value;
  else array.push({ [prop]: value });
  return array;
}

export function convertStyleMap(styleMap: ?TransitionStyleMap, convertStyleValue: (styleValue: Object) => any, processTransform: ?string) {
  const accumulateStyle = (result, styleValue, prop) => {
    let convertedValue;
    if (styleValue && _.isArray(styleValue.outputRange)) {
      const inputRange = styleValue.inputRange || [0, 1];
      convertedValue = convertStyleValue({ ...styleValue, inputRange });
    } else {
      convertedValue = styleValue;
    }
    if (processTransform && isTransformProp(prop)) {
      result['transform'] = mergeTransform(result['transform'], prop, convertedValue);
    } else {
      result[prop] = convertedValue;
    }
    return result;
  };
  const accumulateStyles = (result, style, id) => {
    result[id] = _.reduce(style, accumulateStyle, {});
    return result;
  };
  return styleMap && _.reduce(styleMap, (result, styles, route) => {
    result[route] = _.reduce(styles, accumulateStyles, {});
    return result;
  }, {});
}

const mashStyleMap = (styleMap: ?TransitionStyleMap, duration: number) => {
  invariant(duration >= 0 && duration <= 1, 'duration must be in [0, 1]');
  const mash = (styleValue) => ({
    ...styleValue,
    inputRange: styleValue.inputRange.map(v => v * duration),
  });
  return convertStyleMap(styleMap, mash);
}

export function createTransition(transitionConfig: TransitionConfig): UnboundTransition {
  const { getStyleMap, getStyleMapForClones, canUseNativeDriver, ...rest } = transitionConfig;
  return (filter) => (duration: number) => ({
    filter,
    duration,
    canUseNativeDriver: canUseNativeDriver || (() => true),
    getStyleMap: (...args) => (transitionConfig.getStyleMap && 
      mashStyleMap(transitionConfig.getStyleMap(...args), duration)),
    getStyleMapForClones: (...args) => (transitionConfig.getStyleMapForClones && 
      mashStyleMap(transitionConfig.getStyleMapForClones(...args), duration)),
    ...rest,
  });
}
