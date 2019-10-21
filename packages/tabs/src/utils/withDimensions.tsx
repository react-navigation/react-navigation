import * as React from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

type DimensionsType = {
  width: number;
  height: number;
};

type InjectedProps = {
  dimensions: DimensionsType;
  isLandscape: boolean;
};

export const isOrientationLandscape = ({ width, height }: DimensionsType) =>
  width > height;

export default function withDimensions<Props extends InjectedProps>(
  WrappedComponent: React.ComponentType<Props>
): React.ComponentType<Pick<Props, Exclude<keyof Props, keyof InjectedProps>>> {
  class EnhancedComponent extends React.Component {
    static displayName = `withDimensions(${WrappedComponent.displayName})`;

    constructor(props: Props) {
      super(props);

      const { width, height } = Dimensions.get('window');
      this.state = {
        dimensions: { width, height },
        isLandscape: isOrientationLandscape({ width, height }),
      };
    }

    componentDidMount() {
      Dimensions.addEventListener('change', this.handleOrientationChange);
    }

    componentWillUnmount() {
      Dimensions.removeEventListener('change', this.handleOrientationChange);
    }

    handleOrientationChange = ({ window }: { window: ScaledSize }) => {
      const { width, height } = window;
      this.setState({
        dimensions: { width, height },
        isLandscape: isOrientationLandscape({ width, height }),
      });
    };

    render() {
      // @ts-ignore
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  // @ts-ignore
  return hoistNonReactStatic(EnhancedComponent, WrappedComponent);
}
