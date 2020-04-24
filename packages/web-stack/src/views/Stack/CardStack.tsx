import * as React from 'react';
import { Route, StackNavigationState } from '@react-navigation/native';
import Card from './Card';
import { WebStackDescriptorMap, WebStackDescriptor } from '../../types';

type Props = {
  state: StackNavigationState;
  descriptors: WebStackDescriptorMap;
  routes: Route<string>[];
  openingRouteKeys: string[];
  closingRouteKeys: string[];
  onOpenRoute: (props: { route: Route<string> }) => void;
  onCloseRoute: (props: { route: Route<string> }) => void;
  renderScene: (props: { route: Route<string> }) => React.ReactNode;
};

type State = {
  routes: Route<string>[];
  descriptors: WebStackDescriptorMap;
  scenes: { route: Route<string>; descriptor: WebStackDescriptor }[];
};

const FALLBACK_DESCRIPTOR = Object.freeze({ options: {} });

export default class CardStack extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    if (
      props.routes === state.routes &&
      props.descriptors === state.descriptors
    ) {
      return null;
    }

    return {
      routes: props.routes,
      scenes: props.routes.map((route, index, self) => {
        const previousRoute = self[index - 1];
        const nextRoute = self[index + 1];

        const oldScene = state.scenes[index];

        const descriptor =
          props.descriptors[route.key] ||
          state.descriptors[route.key] ||
          (oldScene ? oldScene.descriptor : FALLBACK_DESCRIPTOR);

        const nextDescriptor =
          props.descriptors[nextRoute?.key] ||
          state.descriptors[nextRoute?.key];

        const previousDescriptor =
          props.descriptors[previousRoute?.key] ||
          state.descriptors[previousRoute?.key];

        const scene = {
          route,
          descriptor,
          __memo: [route, descriptor, nextDescriptor, previousDescriptor],
        };

        if (
          oldScene &&
          scene.__memo.every((it, i) => {
            // @ts-ignore
            return oldScene.__memo[i] === it;
          })
        ) {
          return oldScene;
        }

        return scene;
      }),
      descriptors: props.descriptors,
    };
  }

  state: State = {
    routes: [],
    scenes: [],
    descriptors: this.props.descriptors,
  };

  render() {
    const {
      state,
      routes,
      closingRouteKeys,
      onOpenRoute,
      onCloseRoute,
      renderScene,
    } = this.props;

    const { scenes } = this.state;

    const focusedRoute = state.routes[state.index];

    return (
      <React.Fragment>
        {routes.map((route, index, self) => {
          const focused = focusedRoute.key === route.key;
          const scene = scenes[index];

          return (
            <Card
              key={route.key}
              active={index === self.length - 1}
              focused={focused}
              closing={closingRouteKeys.includes(route.key)}
              route={route as any}
              descriptor={scene.descriptor}
              canGoBack={scenes.length > index}
              renderScene={renderScene}
              onOpenRoute={onOpenRoute}
              onCloseRoute={onCloseRoute}
            />
          );
        })}
      </React.Fragment>
    );
  }
}
