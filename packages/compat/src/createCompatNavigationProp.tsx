import {
  NavigationState,
  PartialState,
  ParamListBase,
  NavigationProp,
  RouteProp,
} from '@react-navigation/core';
import * as helpers from './helpers';

type EventName = 'willFocus' | 'willBlur' | 'didFocus' | 'didBlur' | 'refocus';

const focusSubscriptions = new WeakMap<() => void, () => void>();
const blurSubscriptions = new WeakMap<() => void, () => void>();
const refocusSubscriptions = new WeakMap<() => void, () => void>();

export default function createCompatNavigationProp<
  ParamList extends ParamListBase
>(
  navigation: NavigationProp<ParamList>,
  state:
    | (RouteProp<ParamList, keyof ParamList> & {
        state?: NavigationState | PartialState<NavigationState>;
      })
    | NavigationState
    | PartialState<NavigationState>
) {
  return {
    ...navigation,
    ...Object.entries(helpers).reduce<{
      [key: string]: (...args: any[]) => void;
    }>((acc, [name, method]) => {
      if (name in navigation) {
        acc[name] = (...args: any[]) => {
          // @ts-ignore
          const payload = method(...args);

          navigation.dispatch(
            typeof payload === 'function'
              ? payload(navigation.dangerouslyGetState())
              : payload
          );
        };
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

          // @ts-ignore
          unsubscribe = navigation.addListener('transitionEnd', listener);
          focusSubscriptions.set(callback, unsubscribe);
          break;
        }
        case 'didBlur': {
          const listener = () => {
            if (!navigation.isFocused()) {
              callback();
            }
          };

          // @ts-ignore
          unsubscribe = navigation.addListener('transitionEnd', listener);
          blurSubscriptions.set(callback, unsubscribe);
          break;
        }
        case 'refocus': {
          const listener = () => {
            if (navigation.isFocused()) {
              callback();
            }
          };

          // @ts-ignore
          unsubscribe = navigation.addListener('tabPress', listener);
          refocusSubscriptions.set(callback, unsubscribe);
          break;
        }
        default:
          // @ts-ignore
          unsubscribe = navigation.addListener(type, callback);
      }

      const subscription = () => unsubscribe();

      subscription.remove = unsubscribe;

      return subscription;
    },
    removeListener(type: EventName, callback: () => void) {
      switch (type) {
        case 'willFocus':
          navigation.removeListener('focus', callback);
          break;
        case 'willBlur':
          navigation.removeListener('blur', callback);
          break;
        case 'didFocus': {
          const unsubscribe = focusSubscriptions.get(callback);
          unsubscribe && unsubscribe();
          break;
        }
        case 'didBlur': {
          const unsubscribe = blurSubscriptions.get(callback);
          unsubscribe && unsubscribe();
          break;
        }
        case 'refocus': {
          const unsubscribe = refocusSubscriptions.get(callback);
          unsubscribe && unsubscribe();
          break;
        }
        default:
          // @ts-ignore
          navigation.removeListener(type, callback);
      }
    },
    state: {
      ...state,
      // @ts-ignore
      routeName: state.name,
      get index() {
        // @ts-ignore
        if (state.index !== undefined) {
          // @ts-ignore
          return state.index;
        }

        console.warn(
          "Accessing child navigation state for a route is not safe and won't work correctly."
        );

        // @ts-ignore
        return state.state ? state.state.index : undefined;
      },
      get routes() {
        // @ts-ignore
        if (state.routes !== undefined) {
          // @ts-ignore
          return state.routes;
        }

        console.warn(
          "Accessing child navigation state for a route is not safe and won't work correctly."
        );

        // @ts-ignore
        return state.state ? state.state.routes : undefined;
      },
    },
    getParam<T extends keyof ParamList>(
      paramName: T,
      defaultValue: ParamList[T]
    ): ParamList[T] {
      // @ts-ignore
      const params = state.params;

      if (params && paramName in params) {
        return params[paramName];
      }

      return defaultValue;
    },
    dangerouslyGetParent() {
      const parent = navigation.dangerouslyGetParent();

      if (parent) {
        return createCompatNavigationProp(
          parent,
          navigation.dangerouslyGetState()
        );
      }

      return undefined;
    },
  };
}
