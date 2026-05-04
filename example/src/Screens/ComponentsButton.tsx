import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, type Icon, Text } from '@react-navigation/elements';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import iconHeart from '../../assets/icons/heart.png';

const heartIcon = Platform.select<Icon>({
  ios: { type: 'sfSymbol', name: 'heart' },
  android: { type: 'materialSymbol', name: 'favorite' },
  default: { type: 'image', source: iconHeart },
});

export function ComponentsButton() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Variants</Text>
      <View style={styles.row}>
        <Button variant="plain" onPress={() => {}}>
          Plain
        </Button>
        <Button variant="tinted" onPress={() => {}}>
          Tinted
        </Button>
        <Button variant="filled" onPress={() => {}}>
          Filled
        </Button>
      </View>

      <Text style={styles.heading}>Custom color</Text>
      <View style={styles.row}>
        <Button variant="plain" color="blueviolet" onPress={() => {}}>
          Plain
        </Button>
        <Button variant="tinted" color="blueviolet" onPress={() => {}}>
          Tinted
        </Button>
        <Button variant="filled" color="blueviolet" onPress={() => {}}>
          Filled
        </Button>
      </View>

      <Text style={styles.heading}>Disabled</Text>
      <View style={styles.row}>
        <Button variant="plain" disabled onPress={() => {}}>
          Plain
        </Button>
        <Button variant="tinted" disabled onPress={() => {}}>
          Tinted
        </Button>
        <Button variant="filled" disabled onPress={() => {}}>
          Filled
        </Button>
      </View>

      <Text style={styles.heading}>Icons</Text>
      <View style={styles.row}>
        <Button variant="plain" icon={heartIcon} onPress={() => {}}>
          Plain
        </Button>
        <Button variant="tinted" icon={heartIcon} onPress={() => {}}>
          Tinted
        </Button>
        <Button variant="filled" icon={heartIcon} onPress={() => {}}>
          Filled
        </Button>
        <Button
          variant="filled"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="send" color={color} size={size} />
          )}
          onPress={() => {}}
        >
          Custom
        </Button>
      </View>
    </ScrollView>
  );
}

ComponentsButton.title = 'Components - Button';
ComponentsButton.options = { headerShown: true };
ComponentsButton.linking = {};

const SPACING = 16;

const styles = StyleSheet.create({
  content: {
    padding: SPACING,
    gap: SPACING,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING / 2,
  },
});
