import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/constants/theme';

export default function DeliveriesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Available deliveries will be shown here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  text: {
    fontSize: typography.sizes.base,
    color: colors.neutral[700],
    textAlign: 'center',
  },
});
