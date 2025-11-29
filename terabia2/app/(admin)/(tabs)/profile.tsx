import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function AdminProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>Administrator</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.actionText, styles.actionTextDanger]}>Sign Out</Text>
        </TouchableOpacity>
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
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  name: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.background,
    marginBottom: spacing.xs,
  },
  role: {
    fontSize: typography.sizes.base,
    color: colors.background,
    opacity: 0.9,
  },
  section: {
    padding: spacing.lg,
  },
  actionButton: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: typography.sizes.base,
    fontWeight: '500',
    marginLeft: spacing.base,
  },
  actionTextDanger: {
    color: colors.error,
  },
});
