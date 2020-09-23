import * as React from 'react';
import {
  ScrollView,
  Platform,
  FlatList,
  SectionList,
  RefreshControl,
} from 'react-native';
import { ScrollView as GHScrollView } from 'react-native-gesture-handler';
import createNavigationAwareScrollable from './createNavigationAwareScrollable';
import invariant from './utils/invariant';

let WrappedScrollView;
if (Platform.OS === 'android') {
  // @todo: use GHScrollView again when
  // https://github.com/kmagiera/react-native-gesture-handler/issues/560 has
  // been fixed.
  WrappedScrollView = createNavigationAwareScrollable(ScrollView);
} else {
  WrappedScrollView = createNavigationAwareScrollable(GHScrollView);
}

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
    renderScrollComponent={(props) => (
      <WrappedScrollView {...propsMaybeWithRefreshControl(props)} />
    )}
  />
));

const WrappedSectionList = React.forwardRef((props, ref) => (
  <SectionList
    ref={ref}
    {...props}
    renderScrollComponent={(props) => (
      <WrappedScrollView {...propsMaybeWithRefreshControl(props)} />
    )}
  />
));

export {
  WrappedScrollView as ScrollView,
  WrappedFlatList as FlatList,
  WrappedSectionList as SectionList,
};
