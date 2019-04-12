import React from 'react';
import { FlatList, SectionList, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import createNavigationAwareScrollable from './createNavigationAwareScrollable';
import invariant from './utils/invariant';

const WrappedScrollView = createNavigationAwareScrollable(ScrollView);

function propsMaybeWithRefreshControl(props) {
  const onRefresh = props.onRefresh;
  if (onRefresh) {
    invariant(
      typeof props.refreshing === 'boolean',
      '`refreshing` prop must be set as a boolean in order to use `onRefresh`, but got `' +
        JSON.stringify(props.refreshing) +
        '`'
    );
    return {
      ...props,
      refreshControl:
        props.refreshControl == null ? (
          <RefreshControl
            refreshing={props.refreshing}
            onRefresh={onRefresh}
            progressViewOffset={props.progressViewOffset}
          />
        ) : (
          props.refreshControl
        ),
    };
  } else {
    return props;
  }
}

const WrappedFlatList = React.forwardRef((props, ref) => (
  <FlatList
    ref={ref}
    {...props}
    renderScrollComponent={props => (
      <WrappedScrollView {...propsMaybeWithRefreshControl(props)} />
    )}
  />
));

const WrappedSectionList = React.forwardRef((props, ref) => (
  <SectionList
    ref={ref}
    {...props}
    renderScrollComponent={props => (
      <WrappedScrollView {...propsMaybeWithRefreshControl(props)} />
    )}
  />
));

// eslint-disable-next-line import/no-commonjs
module.exports = {
  ScrollView: WrappedScrollView,
  FlatList: WrappedFlatList,
  SectionList: WrappedSectionList,
};
