import React from 'react';
import { View, Text } from 'react-native';
import renderer from 'react-test-renderer';
import TabRouter from '../../routers/TabRouter';

import TabView from '../TabView/TabView';
import TabBarBottom from '../TabView/TabBarBottom';

const dummyEventSubscriber = (name, handler) => ({
  remove: () => {},
});

describe('TabBarBottom', () => {
  it('renders successfully', () => {
    const navigation = {
      state: {
        index: 0,
        routes: [{ key: 's1', routeName: 's1' }],
      },
      addListener: dummyEventSubscriber,
    };
    const router = TabRouter({ s1: { screen: View } });

    const rendered = renderer
      .create(
        <TabView
          tabBarComponent={TabBarBottom}
          navigation={navigation}
          router={router}
        />
      )
      .toJSON();

    expect(rendered).toMatchSnapshot();
  });
});

describe('TabBarBottom w/ lazyPlaceholder', () => {
  it('renders successfully', () => {
    const navigation = {
      state: {
        index: 0,
        routes: [{ key: 's1', routeName: 's1' }],
      },
      addListener: dummyEventSubscriber,
    };
    const router = TabRouter({ s1: { screen: View } });

    const rendered = renderer
      .create(
        <TabView
          lazy={true}
          lazyPlaceholder={<Text>Loading...</Text>}
          tabBarComponent={TabBarBottom}
          navigation={navigation}
          router={router}
        />
      )
      .toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
