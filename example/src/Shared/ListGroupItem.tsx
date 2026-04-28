import { Text } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

type Props = {
  title?: string;
  children: React.ReactNode;
};

export function ListGroupItem({ title, children }: Props) {
  const { colors, fonts } = useTheme();

  return (
    <View style={styles.container}>
      {title != null ? (
        <Text style={[fonts?.medium, styles.title]}>{title}</Text>
      ) : null}
      <View
        style={[
          styles.group,
          { backgroundColor: colors?.card, borderColor: colors?.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  group: {
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    marginHorizontal: 16,
    fontSize: 13,
    marginBottom: 8,
  },
});
