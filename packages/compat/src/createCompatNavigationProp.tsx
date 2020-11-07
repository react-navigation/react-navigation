import type {
  NavigationState,
  PartialState,
  ParamListBase,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import * as helpers from './helpers';
import type { CompatNavigationProp } from './types';

type EventName =
  | 'action'
  | 'willFocus'
  | 'willBlur'
  | 'didFocus'
  | 'didBlur'
  | 'refocus';

export default function createCompatNavigationProp<
  NavigationPropType extends NavigationProp<ParamListBase>,
  ParamList extends ParamListBase = NavigationPropType extends NavigationProp<
    infer P,
    any,
    any,
    any,
    any
  >
    ? P
    : ParamListBase
>(
  navigation: NavigationPropType,
  state:
    | (RouteProp<ParamList, keyof ParamList> & {
        state?: NavigationState | PartialState<NavigationState>;
      })
    | NavigationState
    | PartialState<NavigationState>,
  context: Record<string, any>,
  isFirstRouteInParent?: boolean
): CompatNavigationProp<NavigationPropType> {
  context.parent = context.parent || {};
  context.subscriptions = context.subscriptions || {
    didFocus: new Map<() => void, () => void>(),
    didBlur: new Map<() => void, () => void>(),
    refocus: new Map<() => void, () => void>(),
  };

  return {
    ...navigation,
    ...Object.entries(helpers).reduce<{
      [key: string]: (...args: any[]) => void;
    }>((acc, [name, method]: [string, Function]) => {
      if (name in navigation) {
        acc[name] = (...args: any[]) => navigation.dispatch(method(...args));
      }

      return acc;
    }, {}),
    original: navigation,
    addListener(type: EventName, callback: () => void) {
      let unsubscribe: () => void;

      switch (type) {
        case 'willFocus':
          unsubscribe = navigation.addListener('focus', callback);
          break;
        case 'willBlur':
          unsubscribe = navigation.addListener('blur', callback);
          break;
        case 'didFocus': {
          const listener = () => {
            if (navigation.isFocused()) {
              callback();
            }
          };

          // @ts-expect-error: this event may not exist in this navigator
          unsubscribe = navigation.addListener('transitionEnd', listener);
          context.subscriptions.didFocus.set(callback, unsubscribe);
          break;
        }
        case 'didBlur': {
          const listener = () => {
            if (!navigation.isFocused()) {
              callback();
            }
          };

          // @ts-expect-error: this event may not exist in this navigator
          unsubscribe = navigation.addListener('transitionEnd', listener);
          context.subscriptions.didBlur.set(callback, unsubscribe);
          break;
        }
        case 'refocus': {
          const listener = () => {
            if (navigation.isFocused()) {
              callback();
            }
          };

          // @ts-expect-error: this event may not exist in this navigator
          unsubscribe = navigation.addListener('tabPress', listener);
          context.subscriptions.refocus.set(callback, unsubscribe);
          break;
        }
        case 'action':
          throw new Error("Listening to 'action' events is not supported.");
        default:
          unsubscribe = navigation.addListener(type, callback);
      }

      const subscription = () => unsubscribe();

      subscription.remove = unsubscribe;

      return subscription;
    },
    removeListener(type: EventName, callback: () => void) {
      context.subscriptions = context.subscriptions || {};

      switch (type) {
        case 'willFocus':
          navigation.removeListener('focus', callback);
          break;
        case 'willBlur':
          navigation.removeListener('blur', callback);
          break;
        case 'didFocus': {
          const unsubscribe = context.subscriptions.didFocus.get(callback);
          unsubscribe?.();
          break;
        }
        case 'didBlur': {
          const unsubscribe = context.subscriptions.didBlur.get(callback);
          unsubscribe?.();
          break;
        }
        case 'refocus': {
          const unsubscribe = context.subscriptions.refocus.get(callback);
          unsubscribe?.();
          break;
        }
        case 'action':
          throw new Error("Listening to 'action' events is not supported.");
        default:
          navigation.removeListener(type, callback);
      }
    },
    state: {
      key: state.key,
      // @ts-expect-error
      routeName: state.name,
      // @ts-expect-error
      params: state.params ?? {},
      get index() {
        // @ts-expect-error
        if (state.index !== undefined) {
          // @ts-expect-error
          return state.index;
        }

        console.warn(
          "Looks like you are using 'navigation.state.index' in your code. Accessing child navigation state for a route is not safe and won't work correctly. You should refactor it not to access the 'index' property in the child navigation state."
        );

        // @ts-expect-error
        return state.state?.index;
      },
      get routes() {
        // @ts-expect-error
        if (state.routes !== undefined) {
          // @ts-expect-error
          return state.routes;
        }

        console.warn(
          "Looks like you are using 'navigation.state.routes' in your code. Accessing child navigation state for a route is not safe and won't work correctly. You should refactor it not to access the 'routes' property in the child navigation state."
        );

        // @ts-expect-error
        return state.state?.routes;
      },
    },
    getParam<T extends keyof ParamList>(
      paramName: T,
      defaultValue: ParamList[T]
    ): ParamList[T] {
      // @ts-expect-error
      const params = state.params;

      if (params && paramName in params) {
        return params[paramName];
      }

      return defaultValue;
    },
    isFirstRouteInParent(): boolean {
      if (typeof isFirstRouteInParent === 'boolean') {
        return isFirstRouteInParent;
      }

      const { routes } = navigation.dangerouslyGetState();

      return routes[0].key === state.key;
    },
    dangerouslyGetParent() {
      const parent = navigation.dangerouslyGetParent();

      if (parent) {
        return createCompatNavigationProp(
          parent,
          navigation.dangerouslyGetState(),
          context.parent
        );
      }

      return undefined;
    },
  } as any;
}
