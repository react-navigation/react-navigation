import * as tv from './TabView';
import * as tb from './TabBar';
import * as tbi from './TabBarIndicator';
import * as types from './types';

// help babel to transpile the types correctly
export type TabViewProps<T extends types.Route> = tv.Props<T>;
export type TabBarProps<T extends types.Route> = tb.Props<T>;
export type TabBarIndicatorProps<T extends types.Route> = tbi.Props<T>;
export type Route = types.Route;
export type NavigationState<T extends types.Route> = types.NavigationState<T>;
export type SceneRendererProps = types.SceneRendererProps;

export { default as TabView } from './TabView';
export { default as TabBar } from './TabBar';
export { default as TabBarIndicator } from './TabBarIndicator';
export { default as SceneMap } from './SceneMap';
export { default as ScrollPager } from './ScrollPager';
