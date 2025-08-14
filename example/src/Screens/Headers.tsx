import { getDefaultHeaderHeight, Header } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Headers() {
  const { dark, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const headerRight = () => (
    <View
      style={{
        margin: 6,
        height:
          getDefaultHeaderHeight({
            landscape: false,
            modalPresentation: false,
            topInset: 0,
          }) - 12,
        width: 64,
        borderRadius: 3,
        backgroundColor: dark
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.1)',
      }}
    />
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        },
      ]}
    >
      <Header
        title="Center aligned"
        headerTitleAlign="center"
        headerStatusBarHeight={0}
      />
      <Header
        title="Center + back button"
        back={{ title: 'Profile', href: undefined }}
        headerTitleAlign="center"
        headerStatusBarHeight={0}
      />
      <Header
        title="Center + long back button"
        back={{ title: 'Very long title', href: undefined }}
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
        headerStatusBarHeight={0}
        headerRight={headerRight}
      />
      <Header
        title="Left + search"
        back={{ title: 'Profile', href: undefined }}
        headerTitleAlign="left"
        headerStatusBarHeight={0}
        headerSearchBarOptions={{
          placeholder: 'Search for something',
        }}
      />
    </ScrollView>
  );
}

Headers.title = 'Headers';
Headers.linking = {};

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
});
