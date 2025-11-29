import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import { Product } from '@/types/database';

interface ProductCardProps {
  product: Product & { seller?: { name: string; rating: number } };
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const images = product.images as string[];
  const imageUrl = images && images.length > 0 ? images[0] : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <View style={styles.lowStockBadge}>
            <Text style={styles.badgeText}>Low Stock</Text>
          </View>
        )}
        {product.stock === 0 && (
          <View style={[styles.lowStockBadge, styles.outOfStockBadge]}>
            <Text style={styles.badgeText}>Out of Stock</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.locationRow}>
          <MapPin size={14} color={colors.neutral[600]} />
          <Text style={styles.location}>{product.location_city}</Text>
        </View>
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>{product.price} XAF</Text>
            <Text style={styles.unit}>per {product.unit}</Text>
          </View>
          {product.seller && (
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName} numberOfLines={1}>
                {product.seller.name}
              </Text>
              {product.seller.rating > 0 && (
                <Text style={styles.rating}>★ {product.seller.rating.toFixed(1)}</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.base,
    ...shadows.md,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.neutral[500],
    fontSize: typography.sizes.sm,
  },
  lowStockBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  outOfStockBadge: {
    backgroundColor: colors.error,
  },
  badgeText: {
    color: colors.background,
    fontSize: typography.sizes.xs,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  location: {
    fontSize: typography.sizes.sm,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.primary.green,
  },
  unit: {
    fontSize: typography.sizes.xs,
    color: colors.neutral[600],
  },
  sellerInfo: {
    alignItems: 'flex-end',
  },
  sellerName: {
    fontSize: typography.sizes.xs,
    color: colors.neutral[700],
    maxWidth: 100,
  },
  rating: {
    fontSize: typography.sizes.xs,
    color: colors.accent.yellow,
    fontWeight: '600',
  },
});
