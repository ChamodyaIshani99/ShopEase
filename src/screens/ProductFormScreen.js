import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import useTheme from '../hooks/useTheme';
import FormInput from '../components/FormInput';
import { addProduct, updateProduct } from '../store/productsSlice';

const isUrl = (s) => /^https?:\/\/\S+/i.test(s.trim());

export default function ProductFormScreen({ route, navigation }) {
  const editing = route.params?.product;
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: editing?.title ?? '',
    price: editing ? String(editing.price) : '',
    category: editing?.category ?? '',
    image: editing?.image ?? '',
    description: editing?.description ?? '',
  });
  const [errors, setErrors] = useState({});

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleSave = () => {
    const errs = {};
    const price = parseFloat(form.price);

    if (form.title.trim().length < 3) errs.title = 'Enter a product name';
    if (!price || price <= 0) errs.price = 'Enter a valid price';
    if (form.category.trim().length < 2) errs.category = 'Enter a category';
    if (!isUrl(form.image)) errs.image = 'Enter a valid image URL (https://...)';
    if (form.description.trim().length < 10) errs.description = 'Write a short description';

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const product = {
      id: editing ? editing.id : 'c' + Date.now(),
      title: form.title.trim(),
      price: Math.round(price * 100) / 100,
      category: form.category.trim().toLowerCase(),
      image: form.image.trim(),
      description: form.description.trim(),
      rating: editing?.rating ?? { rate: 0, count: 0 },
      custom: true,
    };

    dispatch(editing ? updateProduct(product) : addProduct(product));
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isUrl(form.image) && (
          <View style={styles.preview}>
            <Image source={{ uri: form.image.trim() }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          </View>
        )}

        <FormInput
          label="Product name"
          icon="pricetag-outline"
          placeholder="e.g. Wireless Headphones"
          value={form.title}
          onChangeText={(t) => setField('title', t)}
          error={errors.title}
        />
        <FormInput
          label="Price (USD)"
          icon="cash-outline"
          placeholder="e.g. 29.99"
          keyboardType="decimal-pad"
          value={form.price}
          onChangeText={(t) => setField('price', t.replace(/[^0-9.]/g, ''))}
          error={errors.price}
        />
        <FormInput
          label="Category"
          icon="grid-outline"
          placeholder="e.g. electronics"
          autoCapitalize="none"
          value={form.category}
          onChangeText={(t) => setField('category', t)}
          error={errors.category}
        />
        <FormInput
          label="Image URL"
          icon="image-outline"
          placeholder="https://..."
          autoCapitalize="none"
          keyboardType="url"
          value={form.image}
          onChangeText={(t) => setField('image', t)}
          error={errors.image}
        />
        <FormInput
          label="Description"
          icon="document-text-outline"
          placeholder="Describe the product"
          multiline
          value={form.description}
          onChangeText={(t) => setField('description', t)}
          error={errors.description}
        />

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>{editing ? 'Save changes' : 'Add product'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  preview: {
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
  },
  btn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});