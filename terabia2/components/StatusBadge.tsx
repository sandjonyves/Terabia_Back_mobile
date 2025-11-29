import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { OrderStatus, DeliveryStatus, PaymentStatus } from '@/types/database';

interface StatusBadgeProps {
  status: OrderStatus | DeliveryStatus | PaymentStatus;
  size?: 'sm' | 'md';
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: colors.accent.yellow + '20', text: colors.accent.yellow },
  accepted: { bg: colors.info + '20', text: colors.info },
  in_transit: { bg: colors.info + '20', text: colors.info },
  en_route: { bg: colors.info + '20', text: colors.info },
  delivered: { bg: colors.success + '20', text: colors.success },
  cancelled: { bg: colors.error + '20', text: colors.error },
  success: { bg: colors.success + '20', text: colors.success },
  failed: { bg: colors.error + '20', text: colors.error },
  available: { bg: colors.neutral[200], text: colors.neutral[700] },
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  in_transit: 'In Transit',
  en_route: 'En Route',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  success: 'Success',
  failed: 'Failed',
  available: 'Available',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colorScheme = statusColors[status] || statusColors.pending;
  const label = statusLabels[status] || status;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colorScheme.bg },
        size === 'sm' && styles.badgeSm,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colorScheme.text },
          size === 'sm' && styles.textSm,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },
  textSm: {
    fontSize: typography.sizes.xs,
  },
});
