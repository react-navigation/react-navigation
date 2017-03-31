// @flow
import invariant from 'invariant';
import _ from 'lodash';

function createIdRegexFilter(idRegexes) {
  return (id: string) => idRegexes.every(idRegex => id.match(idRegex));
}

export function initTransition(Transition, ...idRegexes) {
  return Transition && Transition(createIdRegexFilter(idRegexes));
}

const isTransformProp = (prop: string) => (
  ['perspective', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 
    'scale', 'scaleX', 'scaleY', 'translateX', 'translateY', 'skewX', 'skewY'].includes(prop)
);

const mergeTransform = (transforms: ?Array<*>, prop: string, value: object) => {
  const array = transforms || [];
  const index = array.find(t => !_.isNil(t[prop]));
  if (index >= 0) array[index][prop] = value;
  else array.push({[prop]: value});
  return array;
}

export function convertStyleMap(styleMap, convertStyleValue: (styleValue: object) => any, processTransform) {
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

const mashStyleMap = (styleMap, duration: number) => {
  invariant(duration >= 0 && duration <= 1, 'duration must be in [0, 1]');
  const mash = (styleValue) => ({
    ...styleValue,
    inputRange: styleValue.inputRange.map(v => v * duration),
  });
  return convertStyleMap(styleMap, mash);
}

export function createTransition(transitionConfig) {
  const { getStyleMap, getStyleMapForClones, canUseNativeDriver, ...rest } = transitionConfig;
  const getStyleMapHO = (op, duration) => (...args) => {
    const originalStyleMap = transitionConfig[op] && transitionConfig[op](...args);
    return mashStyleMap(originalStyleMap, duration);
  };
  return (filter) => (duration: number) => ({
    filter,
    duration,
    canUseNativeDriver: canUseNativeDriver || (() => true),
    getStyleMap: getStyleMapHO('getStyleMap', duration),
    getStyleMapForClones: getStyleMapHO('getStyleMapForClones', duration),
    ...rest,
  });
}
