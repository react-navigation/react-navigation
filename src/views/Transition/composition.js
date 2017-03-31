import _ from 'lodash';
import { convertStyleMap } from './transitionHelpers';

function combineCommonProps(transitions) {
  const filter = (id: string) => transitions.some(t => t.filter(id));
  const getItemsOp = (op: string) => (
    itemsOnFromRoute: Array<*>, 
    itemsOnToRoute: Array<*>) => transitions.reduce((result, t) => {
      const fromItems = itemsOnFromRoute.filter(i => t.filter(i.id));
      const toItems = itemsOnToRoute.filter(i => t.filter(i.id));
      const opResult = t[op] && t[op](fromItems, toItems);
      if (opResult) result = _.union(result, opResult);
      return result;
    }, []);
  const canUseNativeDriver = () => (
    transitions.every(t => _.isNil(t.canUseNativeDriver) || t.canUseNativeDriver())
  );
  const getItemsToClone = getItemsOp('getItemsToClone');
  const getItemsToMeasure = getItemsOp('getItemsToMeasure');
  return {
    filter,
    canUseNativeDriver,
    getItemsToClone,
    getItemsToMeasure,
  };
}

const offsetStyleMap = (styleMap, start) => convertStyleMap(styleMap, (styleValue) => ({
  ...styleValue,
  inputRange: styleValue.inputRange.map(v => toFixed(start + v)),
}));

const mergeStyleValues = (styleValue1, styleValue2) => {
  if ([styleValue1, styleValue2].some(_.isNil)) return styleValue1 || styleValue2;
  if (styleValue1.outputRange && styleValue2.outputRange) {
    //TODO [0, 0.2] + [0.3, 0.4] => [0, 0.2, 0.3, 0.4]
    return styleValue2;
  } else {
    // otherwise, the value comes last overrides the values come before
    return styleValue2;
  }
}

const mergeStyle = (style1, style2) => {
  if ([style1, style2].some(_.isNil)) return style1 || style2;
  const props = _.union(Object.keys(style1), Object.keys(style2));
  return props.reduce((result, prop) => {
    result[prop] = mergeStyleValues(style1[prop], style2[prop]);
    return result;
  }, {});
}

const mergeStyles = (styles1, styles2) => {
  if ([styles1, styles2].some(_.isNil)) return styles1 || styles2;
  const ids = _.union(Object.keys(styles1), Object.keys(styles2));
  return ids.reduce((result, id) => {
    result[id] = mergeStyle(styles1[id], styles2[id]);
    return result;
  }, {});
};

const mergeStyleMap = (left, right) => ({
  from: mergeStyles(left && left.from, right && right.from),
  to: mergeStyles(left && left.to, right && right.to),
});

// http://stackoverflow.com/a/10474055/71133
const toFixed = (n: number) => Math.round(n * 1e12) / 1e12;

export function sequence(...transitions) {
  const getStyleMapOp = (op: string) => (
    itemsOnFromRoute: Array<*>, 
    itemsOnToRoute: Array<*>, 
    transitionProps) => {
    const finalResult = transitions.reduce((result, t) => {
      const fromItems = itemsOnFromRoute.filter(i => t.filter(i.id));
      const toItems = itemsOnToRoute.filter(i => t.filter(i.id));
      const styleMap = t[op] && t[op](fromItems, toItems, transitionProps);
      const start = result.start || t.start || 0;
      result = {
        start: start + t.duration,
        styleMap: mergeStyleMap(result.styleMap, offsetStyleMap(styleMap, start)),
      };
      return result;
    }, {});
    return finalResult.styleMap;
  };
  const duration = transitions.reduce((sum, t) => sum + t.duration, 0);
  const getStyleMap = getStyleMapOp('getStyleMap');
  const getStyleMapForClones = getStyleMapOp('getStyleMapForClones');
  return {
    ...combineCommonProps(transitions),
    duration,
    getStyleMap,
    getStyleMapForClones,
  };
}

export function together(...transitions) {
  const getStyleMapOp = (op: string) => (
    itemsOnFromRoute: Array<*>, 
    itemsOnToRoute: Array<*>, 
    transitionProps) => transitions.reduce((result, t) => {
      // TODO duplicated code in sequence
      const fromItems = itemsOnFromRoute.filter(i => t.filter(i.id));
      const toItems = itemsOnToRoute.filter(i => t.filter(i.id));
      const opResult = t[op] && t[op](fromItems, toItems, transitionProps);
      if (opResult) result = mergeStyleMap(result, opResult);
      return result;
    }, {});
  const duration = transitions.reduce((max, t) => Math.max(max, t.duration), 0);
  const getStyleMap = getStyleMapOp('getStyleMap');
  const getStyleMapForClones = getStyleMapOp('getStyleMapForClones');
  return {
    ...combineCommonProps(transitions),
    duration,
    getStyleMap,
    getStyleMapForClones,
  };
}

export const tg = together;
export const sq = sequence;