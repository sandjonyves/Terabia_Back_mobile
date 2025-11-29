import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { colors, typography, spacing } from '@/constants/theme';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.name}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>
          Admin features coming soon. You'll be able to manage users, view platform statistics,
          and moderate content here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.primary.green,
    padding: spacing.lg,
    paddingTop: spacing['2xl'],
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.background,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.background,
    opacity: 0.9,
  },
  content: {
    padding: spacing.lg,
  },
  text: {
    fontSize: typography.sizes.base,
    color: colors.neutral[700],
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
});
