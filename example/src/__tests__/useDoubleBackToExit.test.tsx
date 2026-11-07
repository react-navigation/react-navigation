/* eslint-disable import-x/no-extraneous-dependencies */
import { beforeEach, expect, jest, test } from '@jest/globals';
import { Text } from '@react-navigation/elements';
import {
  createNavigationContainerRef,
  createNavigatorFactory,
  NavigationContainer,
  type ParamListBase,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/native';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { BackHandler } from 'react-native';

import { useDoubleBackToExit } from '../useDoubleBackToExit';

// Emulate Android BackHandler subscriptions
const backHandlers: ((() => boolean | void))[] = [];

beforeEach(() => {
  backHandlers.length = 0;
  jest.clearAllMocks();
  jest.spyOn(BackHandler, 'addEventListener').mockImplementation(
    (_event: any, handler: any) => {
      backHandlers.push(handler);
      return {
        remove: () => {
          const index = backHandlers.indexOf(handler);
          if (index !== -1) {
            backHandlers.splice(index, 1);
          }
        },
      } as any;
    }
  );
  jest.spyOn(BackHandler, 'exitApp').mockImplementation(() => {});
});

// Emulate Android system back press: calls registered listeners in LIFO order
function pressHardwareBack() {
  for (let i = backHandlers.length - 1; i >= 0; i--) {
    const handled = backHandlers[i]();
    if (handled) {
      return true;
    }
  }
  return false;
}

const createCustomStackNavigator = createNavigatorFactory((props: any) => {
  const { state, descriptors, render } = useNavigationBuilder(
    StackRouter,
    props
  );

  return render(
    state.routes.map((route) => (
      <React.Fragment key={route.key}>
        {descriptors[route.key].render()}
      </React.Fragment>
    ))
  );
});

const createCustomTabNavigator = createNavigatorFactory((props: any) => {
  const { state, descriptors, render } = useNavigationBuilder(TabRouter, props);

  return render(
    state.routes.map((route) => (
      <React.Fragment key={route.key}>
        {descriptors[route.key].render()}
      </React.Fragment>
    ))
  );
});

const CustomStack = createCustomStackNavigator();
const CustomTab = createCustomTabNavigator();

function HomeFeedScreen() {
  return <Text>Home Feed</Text>;
}

function VideoDetailsScreen() {
  return <Text>Video Details</Text>;
}

function ShortsScreen() {
  return <Text>Shorts Screen</Text>;
}

function ProfileScreen() {
  return <Text>Profile Screen</Text>;
}

function NestedHomeStack() {
  return (
    <CustomStack.Navigator>
      <CustomStack.Screen name="HomeFeed" component={HomeFeedScreen} />
      <CustomStack.Screen name="VideoDetails" component={VideoDetailsScreen} />
    </CustomStack.Navigator>
  );
}

function TestRootComponent({
  exitApp,
  showMessage,
}: {
  exitApp: () => void;
  showMessage: (msg: string) => void;
}) {
  const navigation = React.useMemo(() => ({ canGoBack: () => false }), []);

  useDoubleBackToExit(navigation, {
    exitApp,
    showMessage,
    timeout: 2000,
  });

  return null;
}

function TestNestedComponent({
  exitApp,
  showMessage,
}: {
  exitApp: () => void;
  showMessage: (msg: string) => void;
}) {
  const navigation = React.useMemo(() => ({ canGoBack: () => true }), []);

  useDoubleBackToExit(navigation, {
    exitApp,
    showMessage,
    timeout: 2000,
  });

  return null;
}

// Android useBackButton logic from packages/native/src/useBackButton.native.tsx
function useAndroidBackButton(ref: React.RefObject<any>) {
  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        const navigation = ref.current;
        if (navigation == null) {
          return false;
        }
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      }
    );
    return () => subscription.remove();
  }, [ref]);
}

function IntegrationApp({
  navigationRef,
  exitApp,
  showMessage,
}: {
  navigationRef: React.RefObject<any>;
  exitApp: () => void;
  showMessage: (msg: string) => void;
}) {
  useAndroidBackButton(navigationRef);

  useDoubleBackToExit(navigationRef, {
    exitApp,
    showMessage,
    timeout: 2000,
  });

  return (
    <NavigationContainer ref={navigationRef}>
      <CustomTab.Navigator backBehavior="limitedHistory">
        <CustomTab.Screen name="Home" component={NestedHomeStack} />
        <CustomTab.Screen name="Shorts" component={ShortsScreen} />
        <CustomTab.Screen name="Profile" component={ProfileScreen} />
      </CustomTab.Navigator>
    </NavigationContainer>
  );
}

test('double-press back to exit: no exit on first back press, shows message', () => {
  const exitApp = jest.fn();
  const showMessage = jest.fn();

  render(<TestRootComponent exitApp={exitApp} showMessage={showMessage} />);

  // First back press
  act(() => {
    pressHardwareBack();
  });

  expect(showMessage).toHaveBeenCalledTimes(1);
  expect(showMessage).toHaveBeenCalledWith('Press back again to exit');
  expect(exitApp).not.toHaveBeenCalled();
});

test('double-press back to exit: exits on second back press within 2 seconds', () => {
  jest.useFakeTimers();
  const exitApp = jest.fn();
  const showMessage = jest.fn();

  render(<TestRootComponent exitApp={exitApp} showMessage={showMessage} />);

  // First back press at t=0
  act(() => {
    pressHardwareBack();
  });
  expect(showMessage).toHaveBeenCalledTimes(1);
  expect(exitApp).not.toHaveBeenCalled();

  // Advance time by 800ms (< 2000ms)
  act(() => {
    jest.advanceTimersByTime(800);
  });

  // Second back press at t=800ms
  act(() => {
    pressHardwareBack();
  });

  expect(exitApp).toHaveBeenCalledTimes(1);
  jest.useRealTimers();
});

test('double-press back to exit: resets sequence if more than 2 seconds elapse', () => {
  jest.useFakeTimers();
  const exitApp = jest.fn();
  const showMessage = jest.fn();

  render(<TestRootComponent exitApp={exitApp} showMessage={showMessage} />);

  // First back press at t=0
  act(() => {
    pressHardwareBack();
  });
  expect(showMessage).toHaveBeenCalledTimes(1);
  expect(exitApp).not.toHaveBeenCalled();

  // Advance time by 2500ms (> 2000ms timeout)
  act(() => {
    jest.advanceTimersByTime(2500);
  });

  // Second back press after timeout -> should be treated as a NEW first press
  act(() => {
    pressHardwareBack();
  });

  expect(showMessage).toHaveBeenCalledTimes(2);
  expect(exitApp).not.toHaveBeenCalled();

  // Third press within 500ms of the second press -> should exit!
  act(() => {
    jest.advanceTimersByTime(500);
  });
  act(() => {
    pressHardwareBack();
  });

  expect(exitApp).toHaveBeenCalledTimes(1);
  jest.useRealTimers();
});

test('double-press back to exit: does not trigger when navigation can go back', () => {
  const exitApp = jest.fn();
  const showMessage = jest.fn();

  render(<TestNestedComponent exitApp={exitApp} showMessage={showMessage} />);

  act(() => {
    pressHardwareBack();
  });

  // Neither showMessage nor exitApp should be called
  expect(showMessage).not.toHaveBeenCalled();
  expect(exitApp).not.toHaveBeenCalled();
});

test('nested stack navigation takes priority over double-press-to-exit', () => {
  jest.useFakeTimers();
  const exitApp = jest.fn();
  const showMessage = jest.fn();

  const navigationRef = createNavigationContainerRef<ParamListBase>();

  render(
    <IntegrationApp
      navigationRef={navigationRef}
      exitApp={exitApp}
      showMessage={showMessage}
    />
  );

  // 1. Initially on Home > HomeFeed. Root screen: cannot go back.
  expect(navigationRef.current?.canGoBack()).toBe(false);

  // 2. Navigate to nested screen: VideoDetails
  act(() => {
    navigationRef.current?.navigate('VideoDetails');
  });
  expect(navigationRef.current?.canGoBack()).toBe(true);

  // 3. Press back while on nested stack screen
  act(() => {
    const handled = pressHardwareBack();
    expect(handled).toBe(true);
  });

  // Nested stack popped back to HomeFeed! Exit behavior was NOT triggered.
  expect(showMessage).not.toHaveBeenCalled();
  expect(exitApp).not.toHaveBeenCalled();
  expect(navigationRef.current?.canGoBack()).toBe(false);

  // 4. Now we are back at the root screen.
  // First back press: shows exit message
  act(() => {
    const handled = pressHardwareBack();
    expect(handled).toBe(true);
  });
  expect(showMessage).toHaveBeenCalledTimes(1);
  expect(showMessage).toHaveBeenCalledWith('Press back again to exit');
  expect(exitApp).not.toHaveBeenCalled();

  // 5. Second back press within 2s -> exits application!
  act(() => {
    jest.advanceTimersByTime(500);
  });
  act(() => {
    const handled = pressHardwareBack();
    expect(handled).toBe(true);
  });
  expect(exitApp).toHaveBeenCalledTimes(1);

  jest.useRealTimers();
});
