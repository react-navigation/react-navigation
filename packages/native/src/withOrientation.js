import * as React from 'react';
import { Dimensions } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

export const isOrientationLandscape = ({ width, height }) => width > height;

export default function (WrappedComponent) {
  class withOrientation extends React.Component {
    constructor() {
      super();

      this.subscribe = null;

      const isLandscape = isOrientationLandscape(Dimensions.get('window'));
      this.state = { isLandscape };
    }

    componentDidMount() {
      this.subscribe = Dimensions.addEventListener('change', this.handleOrientationChange);
    }

    componentWillUnmount() {
      this.subscribe.remove();
    }

    handleOrientationChange = ({ window }) => {
      const isLandscape = isOrientationLandscape(window);
      this.setState({ isLandscape });
    };

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  return hoistNonReactStatic(withOrientation, WrappedComponent);
}
