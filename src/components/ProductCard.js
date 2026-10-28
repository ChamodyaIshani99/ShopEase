import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = (width - 16 * 2 - 12) / 2;

export default function ProductCard({ product, onPress }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const liked = useSelector((s) => s.wishlist.items.some((p) => p.id === product.id));

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card }]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        <TouchableOpacity
          style={styles.heart}
          onPress={() => dispatch(toggleWishlist(product))}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={18}
            color={liked ? '#EF4444' : '#6B7280'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
          {product.title}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={[styles.rating, { color: colors.subtext }]}>
            {product.rating?.rate ?? '-'} ({product.rating?.count ?? 0})
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={[styles.price, { color: colors.text }]}>
            ${product.price.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => dispatch(addToCart({ product, qty: 1 }))}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 18,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  imageWrap: { backgroundColor: '#fff', height: 150, padding: 14 },
  image: { width: '100%', height: '100%' },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  info: { padding: 12 },
  title: { fontSize: 13, fontWeight: '600', lineHeight: 18, minHeight: 36 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  rating: { fontSize: 11, marginLeft: 4 },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  price: { fontSize: 16, fontWeight: '800' },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});