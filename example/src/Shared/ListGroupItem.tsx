import { Text } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

type Props = {
  title: string;
  children: React.ReactNode;
};

export function ListGroupItem({ title, children }: Props) {
  const { colors, fonts } = useTheme();

  return (
    <View>
      <Text style={[fonts.medium, styles.title]}>{title}</Text>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    marginHorizontal: 32,
    marginTop: 16,
    fontSize: 13,
  },
});
