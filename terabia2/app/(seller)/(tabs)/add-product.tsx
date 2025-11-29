import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/api'; // Updated import
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors, typography, spacing } from '@/constants/theme';
import { Category } from '@/types/database';

export default function AddProductScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    unit: 'kg',
    categoryId: '',
    locationCity: user?.city || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0)
      newErrors.price = 'Invalid price';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)
      newErrors.stock = 'Invalid stock';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.locationCity.trim()) newErrors.locationCity = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post('/products', {
        seller_id: user?.id!,
        title: formData.title,
        description: formData.description || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        unit: formData.unit,
        category_id: parseInt(formData.categoryId),
        location_city: formData.locationCity,
        images: [],
        is_active: true,
      });

      Alert.alert('Success', 'Product added successfully');
      router.push('/(seller)/(tabs)/products');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add New Product</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Product Title"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            error={errors.title}
            required
            placeholder="e.g., Fresh Tomatoes"
          />

          <Input
            label="Description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Optional product description"
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          <Input
            label="Price (XAF)"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            error={errors.price}
            required
            keyboardType="numeric"
            placeholder="0"
          />

          <Input
            label="Stock Quantity"
            value={formData.stock}
            onChangeText={(text) => setFormData({ ...formData, stock: text })}
            error={errors.stock}
            required
            keyboardType="numeric"
            placeholder="0"
          />

          <Input
            label="Unit"
            value={formData.unit}
            onChangeText={(text) => setFormData({ ...formData, unit: text })}
            placeholder="kg, piece, bunch, etc."
          />

          <Input
            label="Location (City)"
            value={formData.locationCity}
            onChangeText={(text) => setFormData({ ...formData, locationCity: text })}
            error={errors.locationCity}
            required
          />

          <Text style={styles.label}>
            Category <Text style={styles.required}>*</Text>
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <Button
                key={cat.id}
                title={cat.name}
                onPress={() => setFormData({ ...formData, categoryId: cat.id.toString() })}
                variant={formData.categoryId === cat.id.toString() ? 'primary' : 'secondary'}
                size="sm"
                style={styles.categoryButton}
              />
            ))}
          </ScrollView>
          {errors.categoryId && (
            <Text style={styles.errorText}>{errors.categoryId}</Text>
          )}

          <Button
            title="Add Product"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.neutral[900],
  },
  form: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  required: {
    color: colors.error,
  },
  categoryScroll: {
    marginBottom: spacing.base,
  },
  categoryButton: {
    marginRight: spacing.sm,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginBottom: spacing.base,
  },
  submitButton: {
    marginTop: spacing.base,
  },
});
