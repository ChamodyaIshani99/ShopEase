import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [qty, setQty] = useState(1);

  const liked = useSelector((s) => s.wishlist.items.some((p) => p.id === product.id));
  const cartCount = useSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0));

  const handleAdd = () => {
    dispatch(addToCart({ product, qty }));
    Alert.alert('Added to cart', `${qty} x ${product.title.slice(0, 40)}...`, [
      { text: 'Keep shopping', style: 'cancel' },
      { text: 'View cart', onPress: () => navigation.navigate('Tabs', { screen: 'Cart' }) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        {/* Image area */}
        <View style={styles.imageArea}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />

          <View style={[styles.topBar, { top: insets.top + 8 }]}>
            <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color="#1A1A2E" />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={[styles.circleBtn, { marginRight: 10 }]}
                onPress={() => dispatch(toggleWishlist(product))}
              >
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={liked ? '#EF4444' : '#1A1A2E'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => navigation.navigate('Tabs', { screen: 'Cart' })}
              >
                <Ionicons name="cart-outline" size={22} color="#1A1A2E" />
                {cartCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Details sheet */}
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={[styles.categoryPill, { backgroundColor: colors.primary + '22' }]}>
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>
              {product.category.toUpperCase()}
            </Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>

          <View style={styles.row}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {product.rating?.rate ?? '-'}
            </Text>
            <Text style={{ color: colors.subtext, marginLeft: 4 }}>
              ({product.rating?.count ?? 0} reviews)
            </Text>
          </View>

          <Text style={[styles.heading, { color: colors.text }]}>Description</Text>
          <Text style={[styles.desc, { color: colors.subtext }]}>{product.description}</Text>

          {/* Quantity */}
          <Text style={[styles.heading, { color: colors.text }]}>Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={[styles.qtyBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Ionicons name="remove" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: colors.text }]}>{qty}</Text>
            <TouchableOpacity
              style={[styles.qtyBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setQty((q) => Math.min(10, q + 1))}
            >
              <Ionicons name="add" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.card,
            paddingBottom: Math.max(insets.bottom, 14),
            borderTopColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={{ color: colors.subtext, fontSize: 12 }}>Total price</Text>
          <Text style={[styles.total, { color: colors.text }]}>
            ${(product.price * qty).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={handleAdd}
          activeOpacity={0.85}
        >
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.addText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageArea: { backgroundColor: '#fff', height: 360, paddingTop: 70, paddingBottom: 30, paddingHorizontal: 30 },
  image: { width: '100%', height: '100%' },
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  sheet: {
    marginTop: -24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  title: { fontSize: 20, fontWeight: '800', marginTop: 12, lineHeight: 28 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ratingText: { marginLeft: 5, fontWeight: '700', fontSize: 14 },
  heading: { fontSize: 16, fontWeight: '800', marginTop: 22, marginBottom: 8 },
  desc: { fontSize: 14, lineHeight: 22 },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontSize: 18, fontWeight: '800', marginHorizontal: 22 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  total: { fontSize: 22, fontWeight: '800' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    height: 52,
    borderRadius: 16,
  },
  addText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 8 },
});