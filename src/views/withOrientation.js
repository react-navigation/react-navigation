// @flow

import * as React from 'react';
import { Dimensions } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

type WindowDimensions = {
  width: number,
  height: number,
};

type InjectedProps = {
  isLandscape: boolean,
};

type State = {
  isLandscape: boolean,
};

export const isOrientationLandscape = ({
  width,
  height,
}: WindowDimensions): boolean => width > height;

export default function<T: {}>(
  WrappedComponent: React.ComponentType<T & InjectedProps>
) {
  class withOrientation extends React.Component<T, State> {
    constructor() {
      super();

      const isLandscape = isOrientationLandscape(Dimensions.get('window'));
      this.state = { isLandscape };
    }

    componentDidMount() {
      Dimensions.addEventListener('change', this.handleOrientationChange);
    }

    componentWillUnmount() {
      Dimensions.removeEventListener('change', this.handleOrientationChange);
    }

    handleOrientationChange = ({ window }: { window: WindowDimensions }) => {
      const isLandscape = isOrientationLandscape(window);
      this.setState({ isLandscape });
    };

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  return hoistNonReactStatic(withOrientation, WrappedComponent);
}
