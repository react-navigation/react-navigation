import { Button, Text } from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';
import { useNavigation, useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { entries, fromEntries } from '../utilities';

export type FormSheetConfig = {
  name: string;
  options: NativeStackNavigationOptions;
  params?: {
    paragraphs?: number;
  };
};

const FORM_SHEETS = {
  FormSheetViewFitToContents: {
    name: 'Fit To Contents',
    options: {
      sheetAllowedDetents: 'fitToContents',
      sheetCornerRadius: 8,
    },
  },
  FormSheetViewHeightsArray: {
    name: 'Height Steps',
    options: {
      sheetAllowedDetents: [0.24, 0.41, 0.8],
      sheetCornerRadius: 8,
    },
    params: {
      paragraphs: 4,
    },
  },
  FormSheetViewNoRoundedCorners: {
    name: 'No Rounded Corners',
    options: {
      sheetAllowedDetents: 'fitToContents',
      sheetCornerRadius: 0,
    },
  },
  FormSheetViewWithGrabber: {
    name: 'Grabber Visible',
    options: {
      sheetAllowedDetents: 'fitToContents',
      sheetCornerRadius: 8,
      sheetGrabberVisible: true,
    },
  },
  FormSheetViewDimming: {
    name: 'Custom Dimming',
    options: {
      sheetAllowedDetents: [0.24, 0.41, 0.8],
      sheetCornerRadius: 8,
      sheetLargestUndimmedDetentIndex: 0,
    },
    params: {
      paragraphs: 4,
    },
  },
  FormSheetViewInitialDetent: {
    name: 'Initial Detent',
    options: {
      sheetAllowedDetents: [0.24, 0.41, 0.8],
      sheetCornerRadius: 8,
      sheetInitialDetentIndex: 'last',
    },
    params: {
      paragraphs: 4,
    },
  },
  FormSheetViewScrollingExpand: {
    name: 'Lock Expanding With Scrolling',
    options: {
      sheetAllowedDetents: [0.41],
      sheetCornerRadius: 8,
      sheetExpandsWhenScrolledToEdge: false,
    },
    params: {
      paragraphs: 10,
    },
  },
  FormSheetViewNoSheetElevation: {
    name: 'Sheet Elevation: 0',
    options: {
      sheetAllowedDetents: 'fitToContents',
      sheetCornerRadius: 8,
      sheetElevation: 0,
      sheetLargestUndimmedDetentIndex: 0,
    },
  },
  FormSheetViewWithSheetElevation: {
    name: 'Sheet Elevation: 48',
    options: {
      sheetAllowedDetents: 'fitToContents',
      sheetCornerRadius: 8,
      sheetElevation: 48,
      sheetLargestUndimmedDetentIndex: 0,
    },
  },
} satisfies Record<string, FormSheetConfig>;

function Main() {
  const navigation = useNavigation('Main');

  return (
    <View style={styles.centered}>
      <View style={styles.buttons}>
        {entries(FORM_SHEETS).map(([key, value]) => (
          <Button
            key={key}
            onPress={() =>
              navigation.navigate(
                key,
                'params' in value ? value.params : undefined
              )
            }
          >
            {value.name}
          </Button>
        ))}

        <Button variant="tinted" onPress={() => navigation.pop()}>
          Pop screen
        </Button>
      </View>
    </View>
  );
}

function FormSheetView({
  route,
}: StaticScreenProps<{ paragraphs?: number } | undefined>) {
  const navigation = useNavigation();
  const paragraph =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ' +
    'aliquam justo at dolor condimentum tincidunt. Proin velit nibh, ' +
    'efficitur non metus a, egestas semper nisi. Proin egestas neque ' +
    'sollicitudin magna semper, id ultrices urna egestas. Aliquam vitae ' +
    'libero vestibulum, ultrices mauris vel, facilisis turpis. Morbi ac ' +
    'volutpat ipsum.';

  const paragraphs =
    route.params?.paragraphs === undefined ? 1 : route.params.paragraphs;

  const textContent = Array(paragraphs).fill(paragraph).join('\n\n');

  return (
    <View>
      <ScrollView>
        <View style={[styles.buttons, styles.closeButtonContainer]}>
          <Button onPress={() => navigation.goBack()} color="red">
            Close
          </Button>
        </View>

        <View style={styles.textContent}>
          <Text>{textContent}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const UnsupportedScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.centered, { backgroundColor: colors?.background }]}>
      <Text style={{ color: colors?.text }}>
        Form Sheet presentation is only available on Android and iOS
      </Text>
    </View>
  );
};

const isFormSheetSupported = Platform.OS === 'android' || Platform.OS === 'ios';

const NativeStackFormSheetNavigator = createNativeStackNavigator({
  groups: {
    Supported: {
      if: () => isFormSheetSupported,
      screens: {
        Main: createNativeStackScreen({
          screen: Main,
          options: {
            title: 'Form Sheet',
          },
        }),
        ...fromEntries(
          entries(FORM_SHEETS).map(([key, config]) => [
            key,
            createNativeStackScreen({
              screen: FormSheetView,
              options: {
                presentation: 'formSheet',
                headerShown: false,
                ...config.options,
              },
            }),
          ])
        ),
      },
    },
    Unsupported: {
      if: () => !isFormSheetSupported,
      screens: {
        Unsupported: createNativeStackScreen({
          screen: UnsupportedScreen,
          options: {
            headerShown: false,
          },
        }),
      },
    },
  },
});

export const NativeStackFormSheet = {
  screen: NativeStackFormSheetNavigator,
  title: 'Native Stack - Form Sheet',
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'column',
    gap: 12,
    padding: 12,
  },
  closeButtonContainer: {
    paddingTop: 20,
    justifyContent: 'center',
  },
  textContent: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flex: 1,
  },
});
