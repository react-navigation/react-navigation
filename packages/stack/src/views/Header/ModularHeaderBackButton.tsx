import * as React from 'react';
import {
  I18nManager,
  Image,
  Text,
  View,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';

import TouchableItem from '../TouchableItem';

import defaultBackImage from '../assets/back-icon.png';
import { HeaderBackbuttonProps } from '../../types';

type Props = HeaderBackbuttonProps & {
  LabelContainerComponent: React.ComponentType;
  ButtonContainerComponent: React.ComponentType;
};

type State = {
  initialTextWidth?: number;
};

class ModularHeaderBackButton extends React.PureComponent<Props, State> {
  static defaultProps = {
    tintColor: '#037aff',
    truncatedTitle: 'Back',
  };

  state: State = {};

  private onTextLayout = (e: LayoutChangeEvent) => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  private renderBackImage() {
    const { backImage, backTitleVisible, tintColor } = this.props;

    if (React.isValidElement(backImage)) {
      return backImage;
    } else if (backImage) {
      const BackImage = backImage;

      return <BackImage tintColor={tintColor} />;
    } else {
      return (
        <Image
          style={[
            styles.icon,
            !!backTitleVisible && styles.iconWithTitle,
            !!tintColor && { tintColor },
          ]}
          source={defaultBackImage}
        />
      );
    }
  }

  private getTitleText = () => {
    const { width, title, truncatedTitle } = this.props;

    let { initialTextWidth } = this.state;

    if (title === null) {
      return null;
    } else if (!title) {
      return truncatedTitle;
    } else if (initialTextWidth && width && initialTextWidth > width) {
      return truncatedTitle;
    } else {
      return title.length > 8 ? truncatedTitle : title;
    }
  };

  private maybeRenderTitle() {
    const { backTitleVisible, titleStyle, tintColor } = this.props;
    let backTitleText = this.getTitleText();

    if (!backTitleVisible || backTitleText === null) {
      return null;
    }

    const { LabelContainerComponent } = this.props;

    return (
      <LabelContainerComponent>
        <Text
          accessible={false}
          onLayout={this.onTextLayout}
          style={[
            styles.title,
            !!tintColor && { color: tintColor },
            titleStyle,
          ]}
          numberOfLines={1}
        >
          {this.getTitleText()}
        </Text>
      </LabelContainerComponent>
    );
  }

  render() {
    const { onPress, title } = this.props;
    const { ButtonContainerComponent } = this.props;

    return (
      <TouchableItem
        accessibilityComponentType="button"
        accessibilityLabel={title ? `${title}, back` : 'Go back'}
        accessibilityTraits="button"
        testID="header-back"
        delayPressIn={0}
        onPress={onPress}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          <ButtonContainerComponent>
            {this.renderBackImage()}
          </ButtonContainerComponent>
          {this.maybeRenderTitle()}
        </View>
      </TouchableItem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 1,
    overflow: 'visible',
  },
  title: {
    fontSize: 17,
    paddingRight: 10,
  },
  icon: {
    height: 21,
    width: 12,
    marginLeft: 9,
    marginRight: 22,
    marginVertical: 12,
    resizeMode: 'contain',
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  iconWithTitle: {
    marginRight: 3,
  },
});

export default ModularHeaderBackButton;
