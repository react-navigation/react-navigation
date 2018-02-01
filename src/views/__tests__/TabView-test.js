import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';

import TabView from '../TabView/TabView';
import TabBarBottom from '../TabView/TabBarBottom';

const dummyEventSubscriber = (name, handler) => ({
  remove: () => {},
});

describe('TabBarBottom', () => {
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
