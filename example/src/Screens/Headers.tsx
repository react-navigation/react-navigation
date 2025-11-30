import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Header, HeaderButton } from '@react-navigation/elements';
import { type StaticScreenProps, useTheme } from '@react-navigation/native';
import {
  type ColorValue,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import balloons from '../../assets/misc/balloons.jpg';

export function Headers(_: StaticScreenProps<{}>) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const headerRight = ({ tintColor }: { tintColor?: ColorValue }) => (
    <>
      <HeaderButton>
        <MaterialCommunityIcons
          name="heart-outline"
          size={24}
          color={tintColor}
        />
      </HeaderButton>
      <HeaderButton>
        <MaterialCommunityIcons
          name="information-outline"
          size={24}
          color={tintColor}
        />
      </HeaderButton>
    </>
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + SPACING,
          paddingLeft: insets.left + SPACING,
          paddingRight: insets.right + SPACING,
        },
      ]}
    >
      <Header
        title="Center aligned"
        headerTitleAlign="center"
        headerStatusBarHeight={0}
      />
      <Header
        title="Center aligned loooooooooooooooooooooooooooooong title"
        headerTitleAlign="center"
        headerStatusBarHeight={0}
      />
      <Header
        title="Center + right area"
        headerTitleAlign="center"
        headerStatusBarHeight={0}
        headerRight={headerRight}
      />
      <Header
        title="Center + back + right area"
        back={{ title: 'Profile', href: undefined }}
        headerTitleAlign="center"
        headerStatusBarHeight={0}
        headerRight={headerRight}
      />
      <Header
        title="Center + search"
        back={{ title: 'Profile', href: undefined }}
        headerTitleAlign="center"
        headerStatusBarHeight={0}
        headerSearchBarOptions={{
          placeholder: 'Search for something',
        }}
      />
      <Header
        title="Left aligned"
        headerTitleAlign="left"
        headerStatusBarHeight={0}
      />
      <Header
        title="Left aligned loooooooooooooooooooooooooooooong title"
        headerTitleAlign="left"
        headerStatusBarHeight={0}
      />
      <Header
        title="Left + back button"
        back={{ title: 'Profile', href: undefined }}
        headerTitleAlign="left"
        headerStatusBarHeight={0}
      />
      <Header
        title="Left + long back button"
        back={{ title: 'Very long title', href: undefined }}
        headerTitleAlign="left"
        headerStatusBarHeight={0}
      />
      <Header
        title="Left + right area"
        headerTitleAlign="left"
        headerStatusBarHeight={0}
        headerRight={headerRight}
      />
      <Header
        title="Left + back + right area"
        back={{ title: 'Profile', href: undefined }}
        headerTitleAlign="left"
        headerBackButtonDisplayMode="minimal"
        headerStatusBarHeight={0}
        headerRight={headerRight}
      />
      <Header
        title="Left + search"
        back={{ title: 'Profile', href: undefined }}
        headerTitleAlign="left"
        headerBackButtonDisplayMode="minimal"
        headerStatusBarHeight={0}
        headerSearchBarOptions={{
          placeholder: 'Search for something',
        }}
      />
      <Header
        title="Center + back"
        back={{ title: 'Short', href: undefined }}
        headerTitleAlign="center"
        headerBackButtonDisplayMode="default"
        headerStatusBarHeight={0}
      />
      <Header
        title="Center + bit longer title"
        back={{ title: 'Longer', href: undefined }}
        headerTitleAlign="center"
        headerBackButtonDisplayMode="default"
        headerStatusBarHeight={0}
      />
      <Header
        title="Center + very very long title"
        back={{ title: 'Very very long', href: undefined }}
        headerBackButtonDisplayMode="default"
        headerTitleAlign="center"
        headerStatusBarHeight={0}
      />
      <ImageBackground
        source={balloons}
        style={[
          styles.imageBackground,
          {
            paddingBottom: insets.bottom + SPACING,
          },
        ]}
      >
        <Header
          title="Transparent"
          back={{ title: 'Profile', href: undefined }}
          headerTitleStyle={{ color: 'rgba(255, 255, 255, 0.9)' }}
          headerRight={headerRight}
          headerTransparent
          headerStatusBarHeight={0}
        />
        <Header
          title="Transparent + Search"
          back={{ title: 'Profile', href: undefined }}
          headerTitleStyle={{ color: 'rgba(255, 255, 255, 0.9)' }}
          headerSearchBarOptions={{
            placeholder: 'Search for something',
          }}
          headerTransparent
          headerStatusBarHeight={0}
        />
        <Header
          title="Transparent + Background"
          back={{ title: 'Profile', href: undefined }}
          headerTitleStyle={{ color: 'rgba(255, 255, 255, 0.9)' }}
          headerRight={headerRight}
          headerTransparent
          headerBackground={() => (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
              ]}
            />
          )}
          headerStatusBarHeight={0}
        />
      </ImageBackground>
    </ScrollView>
  );
}

Headers.title = 'Headers';
Headers.linking = {};

const SPACING = 16;

const styles = StyleSheet.create({
  content: {
    gap: SPACING,
  },
  imageBackground: {
    marginLeft: -SPACING,
    marginRight: -SPACING,
    marginTop: -SPACING / 2,
    paddingTop: SPACING / 2,
    paddingHorizontal: SPACING,
    gap: SPACING,
  },
});
