import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon={<ShoppingBag size={64} color={colors.neutral[400]} />}
            title="Your cart is empty"
            description="Add some fresh products to get started"
            actionLabel="Browse Products"
            onAction={() => router.push('/(buyer)/(tabs)/catalog')}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.itemCount}>{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.itemPrice}>
                {item.price} XAF / {item.unit}
              </Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                >
                  <Minus size={16} color={colors.primary.green} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  <Plus
                    size={16}
                    color={
                      item.quantity >= item.stock
                        ? colors.neutral[400]
                        : colors.primary.green
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemActions}>
              <Text style={styles.itemTotal}>
                {(item.price * item.quantity).toLocaleString()} XAF
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeItem(item.productId)}
              >
                <Trash2 size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{total.toLocaleString()} XAF</Text>
        </View>
        <Button
          title="Proceed to Checkout"
          onPress={() => router.push('/(buyer)/checkout')}
        />
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
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.neutral[900],
  },
  itemCount: {
    fontSize: typography.sizes.base,
    color: colors.neutral[600],
  },
  listContent: {
    padding: spacing.lg,
  },
  cartItem: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    marginBottom: spacing.base,
    ...shadows.sm,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[200],
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemTitle: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  itemPrice: {
    fontSize: typography.sizes.sm,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.accent.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    marginHorizontal: spacing.md,
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.neutral[900],
    minWidth: 24,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: typography.sizes.base,
    fontWeight: '700',
    color: colors.primary.green,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  footer: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    ...shadows.lg,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  totalLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.neutral[700],
  },
  totalAmount: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.primary.green,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: spacing['2xl'],
  },
});
