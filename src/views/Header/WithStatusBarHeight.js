// @flow

import * as React from 'react';
import { Platform, StatusBar, StatusBarIOS, NativeModules } from 'react-native';
const isIos = Platform.OS === 'ios';
const { StatusBarManager } = NativeModules;

// TODO revisit this once https://github.com/facebook/react-native/pull/16478 is out

export type StatusBarHeightState = {
  statusBarTop: number,
  statusBarHeight: number,
};

type Props = {
  render: StatusBarHeightState => React$Element<*>,
};

export default class WithStatusBarHeight extends React.Component {
  props: Props;
  state: StatusBarHeightState;

  constructor(props: Props) {
    super(props);

    const initialHeight = isIos ? 20 : 0;
    this.state = { statusBarTop: 0, statusBarHeight: initialHeight };

    if (isIos) {
      this.fetchCurrentHeightIOS();
    }
  }

  fetchCurrentHeightIOS = () => {
    // we always fetch current height because this is the only way ot works on iphoneX
    StatusBarManager.getHeight(({ height }: { height: number }) => {
      if (Math.abs(this.state.statusBarHeight - height) > 0.01) {
        this.setState({ statusBarHeight: height });
      }
    });
  };

  componentDidMount() {
    StatusBarIOS.addListener(
      'statusBarFrameWillChange',
      this.fetchCurrentHeightIOS
    );
  }

  componentWillUnmount() {
    StatusBarIOS.removeEventListener(
      'statusBarFrameWillChange',
      this.fetchCurrentHeightIOS
    );
  }

  render() {
    return this.props.render(this.state);
  }
}
