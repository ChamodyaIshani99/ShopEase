import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, ActivityIndicator,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import ProductCard from '../components/ProductCard';
import CategoryChips from '../components/CategoryChips';
import { fetchProducts, fetchCategories } from '../api/products';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const user = useSelector((s) => s.auth.user);
  const custom = useSelector((s) => s.products.custom);

  const [products, setProducts] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [selected, setSelected] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [p, c] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(p);
      setApiCategories(c);
    } catch (e) {
      setError('Could not load products. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const allProducts = useMemo(() => [...custom, ...products], [custom, products]);

  const categories = useMemo(
    () => ['all', ...Array.from(new Set([...apiCategories, ...custom.map((p) => p.category)]))],
    [apiCategories, custom]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProducts.filter(
      (p) =>
        (selected === 'all' || p.category === selected) &&
        (q === '' || p.title.toLowerCase().includes(q))
    );
  }, [allProducts, selected, query]);

  const Banner = (
    <View style={[styles.banner, { backgroundColor: colors.primary }]}>
      <View style={styles.circleBig} />
      <View style={styles.circleSmall} />
      <Text style={styles.bannerTag}>LIMITED OFFER</Text>
      <Text style={styles.bannerTitle}>Get 10% off your order</Text>
      <Text style={styles.bannerSub}>Use code SAVE10 at checkout</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.hello, { color: colors.subtext }]}>Welcome back</Text>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.name ? user.name.split(' ')[0] : 'Shopper'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('Wishlist')}
        >
          <Ionicons name="heart-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.subtext} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search products"
          placeholderTextColor={colors.subtext}
          style={[styles.input, { color: colors.text }]}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.subtext} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <View style={{ marginTop: 14, marginBottom: 8 }}>
        <CategoryChips categories={categories} selected={selected} onSelect={setSelected} />
      </View>

      {/* Content */}
      {loading && custom.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error && custom.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.subtext} />
          <Text style={[styles.errorText, { color: colors.subtext }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retry, { backgroundColor: colors.primary }]}
            onPress={load}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 16, marginBottom: 14 }}>
              {Banner}
              <Text style={[styles.section, { color: colors.text }]}>
                {selected === 'all'
                  ? 'Popular products'
                  : selected.charAt(0).toUpperCase() + selected.slice(1)}
              </Text>
              {error && (
                <TouchableOpacity onPress={load} style={{ marginTop: 6 }}>
                  <Text style={{ color: colors.danger, fontSize: 12 }}>
                    Could not load store products. Tap to retry.
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="search-outline" size={48} color={colors.subtext} />
              <Text style={[styles.errorText, { color: colors.subtext }]}>No products found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  hello: { fontSize: 13 },
  name: { fontSize: 24, fontWeight: '800' },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15 },
  banner: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 18,
  },
  circleBig: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  circleSmall: {
    position: 'absolute',
    right: 50,
    bottom: -35,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  bannerTag: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 6 },
  bannerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 },
  section: { fontSize: 18, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorText: { marginTop: 12, fontSize: 14, textAlign: 'center' },
  retry: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryText: { color: '#fff', fontWeight: '700' },
});