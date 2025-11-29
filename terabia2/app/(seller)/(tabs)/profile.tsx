import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Phone, MapPin, LogOut, Star, Award } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';

export default function SellerProfileScreen() {
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={48} color={colors.background} />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>Seller Account</Text>
        {user && user.is_verified && (
          <View style={styles.verifiedBadge}>
            <Award size={16} color={colors.success} />
            <Text style={styles.verifiedText}>Verified Seller</Text>
          </View>
        )}
      </View>

      {user && user.total_ratings > 0 && (
        <View style={styles.ratingSection}>
          <View style={styles.ratingCard}>
            <Star size={32} color={colors.accent.yellow} fill={colors.accent.yellow} />
            <Text style={styles.ratingValue}>{user.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>
              {user.total_ratings} {user.total_ratings === 1 ? 'review' : 'reviews'}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Phone size={20} color={colors.neutral[600]} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MapPin size={20} color={colors.neutral[600]} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>City</Text>
              <Text style={styles.infoValue}>{user?.city}</Text>
            </View>
          </View>

          {user?.cni && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <User size={20} color={colors.neutral[600]} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>CNI</Text>
                  <Text style={styles.infoValue}>{user.cni}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.actionText, styles.actionTextDanger]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Terabia v1.0.0</Text>
    </ScrollView>
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
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
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
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  verifiedText: {
    fontSize: typography.sizes.sm,
    color: colors.background,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  ratingSection: {
    padding: spacing.lg,
  },
  ratingCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  ratingValue: {
    fontSize: typography.sizes['3xl'],
    fontWeight: '700',
    color: colors.neutral[900],
    marginTop: spacing.sm,
  },
  ratingCount: {
    fontSize: typography.sizes.sm,
    color: colors.neutral[600],
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.base,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoContent: {
    marginLeft: spacing.base,
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    color: colors.neutral[600],
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    fontSize: typography.sizes.base,
    color: colors.neutral[900],
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
  },
  actionButton: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  actionText: {
    fontSize: typography.sizes.base,
    fontWeight: '500',
    marginLeft: spacing.base,
  },
  actionTextDanger: {
    color: colors.error,
  },
  version: {
    fontSize: typography.sizes.sm,
    color: colors.neutral[500],
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
