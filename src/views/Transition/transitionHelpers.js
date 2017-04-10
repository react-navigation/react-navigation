// @flow
import invariant from 'invariant';
import _ from 'lodash';
import type {
  TransitionStyleMap,
    UnboundTransition,
    BoundTransition,
    TransitionConfig,
    TransitionFilter,
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

export function convertStyleMap(styleMap: TransitionStyleMap, convertStyleValue: (styleValue: Object) => any, processTransform: ?string) {
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
  return _.reduce(styleMap, (result, styles, route) => {
    result[route] = _.reduce(styles, accumulateStyles, {});
    return result;
  }, {});
}

const normalizeInputRange = (styleMap: TransitionStyleMap, duration: number) => {
  invariant(duration >= 0 && duration <= 1, 'duration must be in [0, 1]');
  const normalize = (styleValue) => ({
    ...styleValue,
    inputRange: styleValue.inputRange.map(v => v * duration),
  });
  return convertStyleMap(styleMap, normalize);
}

export function createTransition(transitionConfig: TransitionConfig): UnboundTransition {
  const { getStyleMap, getStyleMapForClones, canUseNativeDriver, getItemsToMeasure, getItemsToClone } = transitionConfig;
  const createGetStyleMap = (getStyleMapFun, duration) => (...args) => {
    if (getStyleMapFun) {
      const originalStyleMap = getStyleMapFun(...args);
      if (originalStyleMap) return normalizeInputRange(originalStyleMap, duration);
    }
    return { from: {}, to: {} };
  };
  const createGetItems = (getItemsFun) => (...args) => (
    (getItemsFun && getItemsFun(...args)) || []
  );
  return (filter) => (duration: number) => ({
    filter,
    duration,
    canUseNativeDriver: canUseNativeDriver || (() => true),
    getStyleMap: createGetStyleMap(getStyleMap, duration),
    getStyleMapForClones: createGetStyleMap(getStyleMapForClones, duration),
    getItemsToMeasure: createGetItems(getItemsToMeasure),
    getItemsToClone: createGetItems(getItemsToClone),
  });
}
