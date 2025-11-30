// app/(seller)/(tabs)/UpdateScreen.tsx

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
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors, typography, spacing } from '@/constants/theme';
import { Category } from '@/types/database';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function UpdateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { productId } = useLocalSearchParams<{ productId?: string }>(); // ← ID passé depuis la liste

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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

  // Charger les catégories + produit (si édition)
  useEffect(() => {
    loadCategories();

    if (productId) {
      setIsEditMode(true);
      loadProduct(productId);
    } else {
      setIsEditMode(false);
      setLoading(false); // pas de chargement si ajout
    }
  }, [productId]);

  const loadCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProduct = async (id: string) => {
    try {
      const { data } = await api.get(`/products/${id}`);

      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        stock: data.stock?.toString() || '',
        unit: data.unit || 'kg',
        categoryId: data.category_id?.toString() || '',
        locationCity: data.location_city || user?.city || '',
      });
    } catch (error: any) {
      Alert.alert('Erreur', 'Produit introuvable');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.price || isNaN(parseFloat(formData.price)))
      newErrors.price = 'Prix invalide';
    if (!formData.stock || isNaN(parseInt(formData.stock)))
      newErrors.stock = 'Stock invalide';
    if (!formData.categoryId) newErrors.categoryId = 'Catégorie requise';
    if (!formData.locationCity.trim()) newErrors.locationCity = 'Ville requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        unit: formData.unit,
        category_id: parseInt(formData.categoryId),
        location_city: formData.locationCity,
      };

      if (isEditMode && productId) {
        // MODIFICATION
        await api.put(`/products/${productId}`, payload);
        Alert.alert('Succès', 'Produit modifié avec succès !');
      } else {
        // AJOUT
        await api.post('/products', {
          ...payload,
          seller_id: user?.id,
          images: [],
          is_active: true,
        });
        Alert.alert('Succès', 'Produit ajouté avec succès !');
      }

      router.push('/(seller)/(tabs)/products');
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.error || 'Échec de l’opération');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

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
          <Text style={styles.title}>
            {isEditMode ? 'Modifier le produit' : 'Ajouter un produit'}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Titre du produit"
            value={formData.title}
            onChangeText={(t) => setFormData({ ...formData, title: t })}
            error={errors.title}
            required
            placeholder="Ex: Tomates fraîches"
          />

          <Input
            label="Description"
            value={formData.description}
            onChangeText={(t) => setFormData({ ...formData, description: t })}
            placeholder="Description optionnelle"
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          <Input
            label="Prix (XAF)"
            value={formData.price}
            onChangeText={(t) => setFormData({ ...formData, price: t.replace(/[^0-9]/g, '') })}
            error={errors.price}
            required
            keyboardType="numeric"
          />

          <Input
            label="Quantité en stock"
            value={formData.stock}
            onChangeText={(t) => setFormData({ ...formData, stock: t.replace(/[^0-9]/g, '') })}
            error={errors.stock}
            required
            keyboardType="numeric"
          />

          <Input
            label="Unité"
            value={formData.unit}
            onChangeText={(t) => setFormData({ ...formData, unit: t })}
            placeholder="kg, pièce, botte..."
          />

          <Input
            label="Ville de localisation"
            value={formData.locationCity}
            onChangeText={(t) => setFormData({ ...formData, locationCity: t })}
            error={errors.locationCity}
            required
          />

          <Text style={styles.label}>
            Catégorie <Text style={styles.required}>*</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
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
          {errors.categoryId && <Text style={styles.errorText}>{errors.categoryId}</Text>}

          <Button
            title={isEditMode ? 'Enregistrer les modifications' : 'Ajouter le produit'}
            onPress={handleSubmit}
            loading={saving}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles (identiques à ton AddProductScreen)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  header: { marginBottom: spacing.lg },
  title: { fontSize: typography.sizes['2xl'], fontWeight: '700', color: colors.neutral[900] },
  form: { marginBottom: spacing.xl },
  label: { fontSize: typography.sizes.sm, color: colors.neutral[700], marginBottom: spacing.sm, fontWeight: '500' },
  required: { color: colors.error },
  categoryScroll: { marginBottom: spacing.base },
  categoryButton: { marginRight: spacing.sm },
  errorText: { fontSize: typography.sizes.xs, color: colors.error, marginBottom: spacing.base },
  submitButton: { marginTop: spacing.xl },
});