import * as React from 'react';
import { Animated, Platform } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';

const AnimatedBaseButton = Animated.createAnimatedComponent(BaseButton);

type Props = React.ComponentProps<typeof BaseButton> & {
  activeOpacity: number;
};

const useNativeDriver = Platform.OS !== 'web';

export default class TouchableItem extends React.Component<Props> {
  static defaultProps = {
    activeOpacity: 0.3,
    borderless: true,
    enabled: true,
  };

  private opacity = new Animated.Value(1);

  private handleActiveStateChange = (active: boolean) => {
    Animated.spring(this.opacity, {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
      toValue: active ? this.props.activeOpacity : 1,
      useNativeDriver,
    }).start();

    this.props.onActiveStateChange?.(active);
  };

  render() {
    const { children, style, enabled, ...rest } = this.props;

    return (
      <AnimatedBaseButton
        {...rest}
        onActiveStateChange={this.handleActiveStateChange}
        style={[style, enabled && { opacity: this.opacity }]}
      >
        {children}
      </AnimatedBaseButton>
    );
  }
}
