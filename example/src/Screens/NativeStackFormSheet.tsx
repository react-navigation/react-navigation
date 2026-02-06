import { Button, Text } from '@react-navigation/elements';
import { type RouteProp, useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Platform, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

type FormSheetParams = {
  paragraphs?: number;
};

export type FormSheetConfig = {
  name: string;
  options: NativeStackNavigationOptions;
  params?: FormSheetParams;
};

const FORM_SHEETS: Record<string, FormSheetConfig> = {
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
};

export type RouteParamList = {
  Main: undefined;
  FormSheet: FormSheetParams;
} & {
  [Key in keyof typeof FORM_SHEETS]: FormSheetParams;
};

type RouteProps<RouteName extends keyof RouteParamList> = {
  navigation: NativeStackNavigationProp<RouteParamList, RouteName>;
  route: RouteProp<RouteParamList, RouteName>;
};

const Stack = createNativeStackNavigator<RouteParamList>();

function Main({ navigation }: RouteProps<'Main'>) {
  return (
    <View style={styles.centered}>
      <View style={styles.buttons}>
        {Object.entries(FORM_SHEETS).map(([key, value]) => (
          <Button
            key={key}
            onPress={() =>
              navigation.navigate(
                key as keyof typeof FORM_SHEETS,
                value.params ?? {}
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

function FormSheetView<T extends keyof typeof FORM_SHEETS>({
  navigation,
  route,
}: RouteProps<T>) {
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

export function NativeStackFormSheet() {
  const { colors } = useTheme();

  if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>
          Form Sheet presentation is only available on Android and iOS
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={Main}
        options={{
          title: 'Form Sheet',
        }}
      />
      {Object.entries(FORM_SHEETS).map(([key, value]) => (
        <Stack.Screen
          key={key}
          name={key as keyof typeof FORM_SHEETS}
          component={FormSheetView}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            ...value.options,
          }}
        />
      ))}
    </Stack.Navigator>
  );
}

NativeStackFormSheet.title = 'Native Stack - Form Sheet';
NativeStackFormSheet.linking = {};

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
