import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, Package, DollarSign, ShoppingBag } from 'lucide-react-native';
import api from '@/lib/api'; // Updated import
import { useAuth } from '@/contexts/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
      useCallback(() => {
    if (user?.id) {
      loadStats(user.id);
    }
  }, [user?.id])

  )

const loadStats = async (sellerId: string) => {
  try {
    const { data } = await api.get(`/users/stats/${sellerId}`);
    
    // AJOUTE CETTE LIGNE MAGIQUE
    console.log("Données brutes reçues du backend :", data);

    // Force la conversion en nombres + fallback sécurisé
    const newStats = {
      totalProducts: Number(data.totalProducts) || 0,
      activeProducts: Number(data.activeProducts) || 0,
      totalOrders: Number(data.totalOrders) || 0,
      totalRevenue: Number(data.totalRevenue) || 0,
    };

    console.log("Stats après conversion en nombre :", newStats);

    setStats(newStats);
  } catch (error: any) {
    console.error('Error loading stats:', error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <LoadingSpinner />;
  }

  const statCards = [
    {
      icon: Package,
      label: 'Total Products',
      value: stats.totalProducts.toString(),
      color: colors.primary.green,
    },
    {
      icon: ShoppingBag,
      label: 'Active Listings',
      value: stats.activeProducts.toString(),
      color: colors.info,
    },
    {
      icon: TrendingUp,
      label: 'Total Orders',
      value: stats.totalOrders.toString(),
      color: colors.accent.terracotta,
    },
    {
      icon: DollarSign,
      label: 'Revenue',
      value: `${Math.round(stats.totalRevenue).toLocaleString()} XAF`,
      color: colors.accent.yellow,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]}!</Text>
        <Text style={styles.subtitle}>Here's your business overview</Text>
      </View>

      <View style={styles.statsContainer}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                <Icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <Text style={styles.actionText}>
            Add new products, manage inventory, and view orders from the tabs below.
          </Text>
        </View>
      </View>
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
    padding: spacing.lg,
    paddingTop: spacing['2xl'],
  },
  greeting: {
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.lg,
    gap: spacing.base,
  },
  statCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    width: '48%',
    ...shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.neutral[900],
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.neutral[600],
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.base,
  },
  actionsGrid: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    ...shadows.sm,
  },
  actionText: {
    fontSize: typography.sizes.base,
    color: colors.neutral[600],
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
});
