/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';
import shortid from 'shortid';
import {
  useNavigationBuilder,
  NavigationProp,
  CommonAction,
  ParamListBase,
  Router,
} from '../src/index';

type Props = {
  initialRouteName?: string;
  children: React.ReactNode;
};

type Action =
  | {
      type: 'PUSH';
      payload: { name: string; params?: object };
    }
  | {
      type: 'POP';
      payload: { count: number };
    }
  | { type: 'POP_TO_TOP' };

export type StackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<ParamList, RouteName> & {
  /**
   * Push a new screen onto the stack.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  push<RouteName extends keyof ParamList>(
    ...args: ParamList[RouteName] extends void
      ? [RouteName]
      : [RouteName, ParamList[RouteName]]
  ): void;

  /**
   * Pop a screen from the stack.
   */
  pop(count?: number): void;

  /**
   * Pop to the first route in the stack, dismissing all other screens.
   */
  popToTop(): void;
};

const StackRouter: Router<CommonAction | Action> = {
  getInitialState({
    screens,
    partialState,
    initialRouteName = Object.keys(screens)[0],
  }) {
    const routeNames = Object.keys(screens);

    let state = partialState;

    if (state === undefined) {
      const index = routeNames.indexOf(initialRouteName);

      state = {
        index,
        routes: routeNames.slice(0, index + 1).map(name => ({
          name,
          key: `${name}-${shortid()}`,
          params: screens[name].initialParams,
        })),
      };
    }

    if (state.names === undefined || state.key === undefined) {
      state = {
        ...state,
        names: state.names || routeNames,
        key: state.key || `stack-${shortid()}`,
      };
    }

    return state;
  },

  getStateForAction(state, action) {
    switch (action.type) {
      case 'PUSH':
        if (state.names.includes(action.payload.name)) {
          return {
            ...state,
            index: state.index + 1,
            routes: [
              ...state.routes,
              {
                key: `${action.payload.name}-${shortid()}`,
                name: action.payload.name,
                params: action.payload.params,
              },
            ],
          };
        }

        return null;

      case 'POP':
        if (state.index > 0) {
          return {
            ...state,
            index: state.index - 1,
            routes: state.routes.slice(
              0,
              Math.max(state.routes.length - action.payload.count, 1)
            ),
          };
        }

        return null;

      case 'POP_TO_TOP':
        return StackRouter.getStateForAction(state, {
          type: 'POP',
          payload: { count: state.routes.length - 1 },
        });

      case 'NAVIGATE':
        if (state.names.includes(action.payload.name)) {
          // If the route already exists, navigate to that
          let index = -1;

          if (state.routes[state.index].name === action.payload.name) {
            index = state.index;
          } else {
            for (let i = state.routes.length - 1; i >= 0; i--) {
              if (state.routes[i].name === action.payload.name) {
                index = i;
                break;
              }
            }
          }

          if (index === -1) {
            return StackRouter.getStateForAction(state, {
              type: 'PUSH',
              payload: action.payload,
            });
          }

          return {
            ...state,
            index,
            routes: [
              ...state.routes.slice(0, index),
              action.payload.params !== undefined
                ? { ...state.routes[index], params: action.payload.params }
                : state.routes[index],
            ],
          };
        }

        return null;

      case 'REPLACE': {
        return {
          ...state,
          routes: state.routes.map((route, i) =>
            i === state.index
              ? {
                  key: `${action.payload.name}-${shortid()}`,
                  name: action.payload.name,
                  params: action.payload.params,
                }
              : route
          ),
        };
      }

      case 'GO_BACK':
        return StackRouter.getStateForAction(state, {
          type: 'POP',
          payload: { count: 1 },
        });

      case 'RESET': {
        if (
          action.payload.key === undefined ||
          action.payload.key === state.key
        ) {
          return {
            ...action.payload,
            key: state.key,
            names: state.names,
          };
        }

        return null;
      }

      default:
        return null;
    }
  },

  actionCreators: {
    push(name: string, params?: object) {
      return { type: 'PUSH', payload: { name, params } };
    },
    pop(count: number = 1) {
      return { type: 'POP', payload: { count } };
    },
    popToTop() {
      return { type: 'POP_TO_TOP' };
    },
  },
};

export default function StackNavigator(props: Props) {
  const { navigation, descriptors } = useNavigationBuilder(StackRouter, props);

  return (
    <div style={{ position: 'relative' }}>
      {navigation.state.routes.map((route, i) => (
        <div
          key={route.key}
          style={{
            position: 'absolute',
            margin: 20,
            left: i * 20,
            top: i * 20,
            padding: 10,
            height: 480,
            width: 320,
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow:
              '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
          }}
        >
          {descriptors[route.key].render()}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: 40,
          width: 120,
          padding: 10,
          backgroundColor: 'tomato',
          borderRadius: 3,
          boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        }}
      >
        {
          descriptors[navigation.state.routes[navigation.state.index].key]
            .options.title
        }
      </div>
    </div>
  );
}
