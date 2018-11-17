import React from 'react';
import { FlatList, SectionList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import createNavigationAwareScrollable from './createNavigationAwareScrollable';

const WrappedScrollView = createNavigationAwareScrollable(ScrollView);

const WrappedFlatList = React.forwardRef((props, ref) => (
  <FlatList
    ref={ref}
    {...props}
    renderScrollComponent={props => <WrappedScrollView {...props} />}
  />
));

const WrappedSectionList = React.forwardRef((props, ref) => (
  <SectionList
    ref={ref}
    {...props}
    renderScrollComponent={props => <WrappedScrollView {...props} />}
  />
));

// eslint-disable-next-line import/no-commonjs
module.exports = {
  ScrollView: WrappedScrollView,
  FlatList: WrappedFlatList,
  SectionList: WrappedSectionList,
};
