import { Text } from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';

export function ComponentsScrollInsets(_: StaticScreenProps<{}>) {
  return <Text>Scroll insets are available on iOS and Android.</Text>;
}

ComponentsScrollInsets.title = 'Components - Scroll Insets';
ComponentsScrollInsets.options = { headerShown: true };
ComponentsScrollInsets.linking = { path: 'scroll-insets' };
