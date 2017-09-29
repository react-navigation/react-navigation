import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

const isOrientationLandscape = ({ width, height }) => width > height;

export default WrappedComponent => {
  class withOrientation extends Component {
    constructor(props) {
      super(props);

      const isLandscape = isOrientationLandscape(Dimensions.get('window'));
      this.state = {
        isLandscape,
        isPortrait: !isLandscape,
      };
    }

    componentDidMount() {
      Dimensions.addEventListener('change', this.handleOrientationChange);
    }

    componentWillUnmount() {
      Dimensions.removeEventListener('change', this.handleOrientationChange);
    }

    handleOrientationChange = ({ window }) => {
      const isLandscape = isOrientationLandscape(window);
      this.setState({
        isLandscape,
        isPortrait: !isLandscape,
      });
    };

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  return hoistNonReactStatic(withOrientation, WrappedComponent);
};
