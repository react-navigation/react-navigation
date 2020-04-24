import * as React from 'react';
import {
  NavigationContext,
  NavigationRouteContext,
  Route,
  RouteProp,
  ParamListBase,
  useTheme,
} from '@react-navigation/native';
import Header from '../Header/Header';
import { WebStackDescriptor, WebStackNavigationProp } from '../../types';

type Props = {
  active: boolean;
  focused: boolean;
  closing: boolean;
  route: RouteProp<ParamListBase, string>;
  descriptor: WebStackDescriptor;
  canGoBack: boolean;
  renderScene: (props: { route: Route<string> }) => React.ReactNode;
  onOpenRoute: (props: { route: Route<string> }) => void;
  onCloseRoute: (props: { route: Route<string> }) => void;
};

function Card({
  active,
  closing,
  focused,
  canGoBack,
  onCloseRoute,
  onOpenRoute,
  renderScene,
  route,
  descriptor,
}: Props) {
  const { colors } = useTheme();
  const { options, navigation } = descriptor;

  const headerProps = {
    canGoBack,
    route,
    descriptor,
    navigation: navigation as WebStackNavigationProp<ParamListBase>,
  };

  return (
    <NavigationContext.Provider key={route.key} value={descriptor.navigation}>
      <NavigationRouteContext.Provider value={route}>
        <div
          aria-hidden={focused ? true : false}
          style={{
            opacity: active ? 1 : 0,
            pointerEvents: focused ? 'auto' : 'none',
            backgroundColor: colors.background,
            ...styles.container,
            ...options.cardStyle,
          }}
          onTransitionEnd={() => {
            if (closing) {
              onCloseRoute({ route });
            } else {
              onOpenRoute({ route });
            }
          }}
        >
          {options.headerShown !== false ? (
            options.header !== undefined ? (
              options.header(headerProps)
            ) : (
              <Header {...headerProps} />
            )
          ) : null}
          {renderScene({ route })}
        </div>
      </NavigationRouteContext.Provider>
    </NavigationContext.Provider>
  );
}

export default React.memo(Card);

const styles = {
  container: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transitionDuration: '200ms',
  },
};
