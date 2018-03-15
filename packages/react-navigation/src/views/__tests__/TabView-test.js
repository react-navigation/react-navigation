import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';

const {
  TabView,
  TabBarBottom,
} = require('react-navigation-deprecated-tab-navigator');

const dummyEventSubscriber = (name, handler) => ({
  remove: () => {},
});

describe('TabBarBottom', () => {
  jest.useFakeTimers();

  it('renders successfully', () => {
    const route = { key: 's1', routeName: 's1' };
    const navigation = {
      state: {
        index: 0,
        routes: [route],
      },
      addListener: dummyEventSubscriber,
    };

    const rendered = renderer
      .create(
        <TabView
          tabBarComponent={TabBarBottom}
          navigation={navigation}
          navigationConfig={{}}
          descriptors={{
            s1: {
              state: route,
              key: route.key,
              options: {},
              navigation: { state: route },
              getComponent: () => View,
            },
          }}
        />
      )
      .toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
