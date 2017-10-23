// @flow

import React from 'react';
import { Platform, StatusBar, StatusBarIOS, NativeModules } from 'react-native';
const isIos = Platform.OS === 'ios';
const { StatusBarManager } = NativeModules;

// TODO revisit this once https://github.com/facebook/react-native/pull/16478 is out
type StatusBarFrame = {
  y: number,
  height: number,
};

type StatusBarDataType = {
  frame: StatusBarFrame,
};

export type StatusBarHeightState = {
  statusBarTop: number,
  statusBarHeight: number,
};

type Props = {
  render: StatusBarHeightState => React$Element<*>,
};

export default class WithStatusBarHeight extends React.Component<
  Props,
  T,
  StatusBarHeightState
> {
  state: StatusBarHeightState;

  constructor(props: Props) {
    super(props);

    const initialHeight = isIos ? 20 : 0;
    this.state = { statusBarTop: 0, statusBarHeight: initialHeight };
    if (isIos) {
      this.fetchInitialHeightIOS();
    }
  }

  fetchInitialHeightIOS() {
    StatusBarManager.getHeight(({ height }: { height: number }) => {
      if (Math.abs(this.state.statusBarHeight - height) > 0.01) {
        this.setState({ statusBarHeight: height });
      }
    });
  }

  componentDidMount() {
    StatusBarIOS.addListener(
      'statusBarFrameDidChange',
      this.handleStatusBarHeightChange
    );
  }

  componentWillUnmount() {
    StatusBarIOS.removeEventListener(
      'statusBarFrameDidChange',
      this.handleStatusBarHeightChange
    );
  }

  handleStatusBarHeightChange = (statusBarData: StatusBarDataType) => {
    const { y, height } = statusBarData.frame;
    this.setState({ statusBarTop: y, statusBarHeight: height });
  };

  render() {
    return this.props.render(this.state);
  }
}
