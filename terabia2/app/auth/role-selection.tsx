import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, Store, Truck } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import { UserRole } from '@/types/database';

export default function RoleSelection() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles = [
    {
      role: 'buyer' as UserRole,
      icon: ShoppingBag,
      title: 'Buyer',
      description: 'Browse and purchase fresh agricultural products',
    },
    {
      role: 'seller' as UserRole,
      icon: Store,
      title: 'Seller / Farmer',
      description: 'List and sell your farm products',
    },
    {
      role: 'delivery' as UserRole,
      icon: Truck,
      title: 'Delivery Agency',
      description: 'Deliver products and earn money',
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      router.push({
        pathname: '/auth/signup',
        params: { role: selectedRole },
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Terabia</Text>
        <Text style={styles.subtitle}>
          Your agricultural marketplace connecting farmers, buyers, and delivery services
        </Text>
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedRole === item.role;

          return (
            <TouchableOpacity
              key={item.role}
              style={[styles.roleCard, isSelected && styles.roleCardSelected]}
              onPress={() => setSelectedRole(item.role)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  isSelected && styles.iconContainerSelected,
                ]}
              >
                <Icon
                  size={32}
                  color={isSelected ? colors.background : colors.primary.green}
                />
              </View>
              <Text style={styles.roleTitle}>{item.title}</Text>
              <Text style={styles.roleDescription}>{item.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !selectedRole && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!selectedRole}
        activeOpacity={0.7}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signInLink}
        onPress={() => router.push('/auth/login')}
      >
        <Text style={styles.signInText}>
          Already have an account? <Text style={styles.signInTextBold}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing['2xl'],
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: '700',
    color: colors.primary.green,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.neutral[600],
    textAlign: 'center',
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
  },
  rolesContainer: {
    marginBottom: spacing.xl,
  },
  roleCard: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.base,
    alignItems: 'center',
    ...shadows.sm,
  },
  roleCardSelected: {
    borderColor: colors.primary.green,
    ...shadows.md,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.sand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary.green,
  },
  roleTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  roleDescription: {
    fontSize: typography.sizes.sm,
    color: colors.neutral[600],
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: colors.primary.green,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: colors.background,
    fontSize: typography.sizes.lg,
    fontWeight: '600',
  },
  signInLink: {
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
  signInText: {
    fontSize: typography.sizes.base,
    color: colors.neutral[600],
  },
  signInTextBold: {
    color: colors.primary.green,
    fontWeight: '600',
  },
});
