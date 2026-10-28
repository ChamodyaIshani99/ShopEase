import React, { useState } from 'react';
import {
  View, Text, Image, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import {
  COUPONS,
  increaseQty,
  decreaseQty,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  clearCart,
  selectSubtotal,
  selectDiscount,
  selectTotal,
} from '../store/cartSlice';

export default function CartScreen({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const items = useSelector((s) => s.cart.items);
  const coupon = useSelector((s) => s.cart.coupon);
  const subtotal = useSelector(selectSubtotal);
  const discount = useSelector(selectDiscount);
  const total = useSelector(selectTotal);

  const [code, setCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApply = () => {
    Keyboard.dismiss();
    const c = code.trim().toUpperCase();
    if (!c) return;
    if (COUPONS[c]) {
      dispatch(applyCoupon(c));
      setCode('');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleClear = () => {
    Alert.alert('Clear cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => dispatch(clearCart()) },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: colors.card }]}>
      <View style={styles.imgBox}>
        <Image source={{ uri: item.image }} style={styles.img} resizeMode="contain" />
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} style={[styles.itemTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <TouchableOpacity
            onPress={() => dispatch(removeFromCart(item.id))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={19} color={colors.danger} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <Text style={[styles.itemPrice, { color: colors.text }]}>
            ${(item.price * item.qty).toFixed(2)}
          </Text>

          <View style={styles.qtyWrap}>
            <TouchableOpacity
              style={[styles.qtyBtn, { borderColor: colors.border }]}
              onPress={() => dispatch(decreaseQty(item.id))}
            >
              <Ionicons name="remove" size={16} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: colors.text }]}>{item.qty}</Text>
            <TouchableOpacity
              style={[styles.qtyBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
              onPress={() => dispatch(increaseQty(item.id))}
            >
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  // Empty state
  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>My Cart</Text>
        </View>
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="cart-outline" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
          <Text style={{ color: colors.subtext, textAlign: 'center', marginTop: 6 }}>
            Looks like you haven't added anything yet.
          </Text>
          <TouchableOpacity
            style={[styles.shopBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopBtnText}>Start shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>My Cart</Text>
          <Text style={{ color: colors.subtext }}>
            {items.reduce((n, i) => n + i.qty, 0)} items
          </Text>
        </View>
        <TouchableOpacity onPress={handleClear}>
          <Text style={{ color: colors.danger, fontWeight: '700' }}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          <View style={{ marginTop: 6 }}>
            {/* Coupon */}
            <View style={[styles.couponCard, { backgroundColor: colors.card }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
                <Text style={[styles.couponTitle, { color: colors.text }]}>Promo code</Text>
              </View>

              {coupon ? (
                <View style={[styles.applied, { backgroundColor: colors.primary + '1A' }]}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  <Text style={{ flex: 1, marginLeft: 8, color: colors.text, fontWeight: '700' }}>
                    {coupon} applied ({COUPONS[coupon]}% off)
                  </Text>
                  <TouchableOpacity onPress={() => dispatch(removeCoupon())}>
                    <Ionicons name="close-circle" size={22} color={colors.subtext} />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.couponRow}>
                    <TextInput
                      value={code}
                      onChangeText={(t) => {
                        setCode(t);
                        setCouponError('');
                      }}
                      placeholder="Enter code (try SAVE10)"
                      placeholderTextColor={colors.subtext}
                      autoCapitalize="characters"
                      style={[
                        styles.couponInput,
                        { color: colors.text, borderColor: couponError ? colors.danger : colors.border },
                      ]}
                    />
                    <TouchableOpacity
                      style={[styles.applyBtn, { backgroundColor: colors.primary }]}
                      onPress={handleApply}
                    >
                      <Text style={{ color: '#fff', fontWeight: '700' }}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                  {!!couponError && (
                    <Text style={{ color: colors.danger, fontSize: 12, marginTop: 6 }}>
                      {couponError}
                    </Text>
                  )}
                </>
              )}
            </View>
          </View>
        }
      />

      {/* Summary + checkout */}
      <View style={[styles.summary, { backgroundColor: colors.card }]}>
        <View style={styles.sumRow}>
          <Text style={{ color: colors.subtext }}>Subtotal</Text>
          <Text style={{ color: colors.text, fontWeight: '600' }}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.sumRow}>
          <Text style={{ color: colors.subtext }}>Discount</Text>
          <Text style={{ color: discount > 0 ? '#10B981' : colors.text, fontWeight: '600' }}>
            -${discount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.sumRow}>
          <Text style={{ color: colors.subtext }}>Delivery</Text>
          <Text style={{ color: '#10B981', fontWeight: '600' }}>Free</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.sumRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14 },
  title: { fontSize: 26, fontWeight: '800' },

  item: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imgBox: {
    width: 86,
    height: 86,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 8,
  },
  img: { width: '100%', height: '100%' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  itemTitle: { flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 18, marginRight: 8 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  itemPrice: { fontSize: 16, fontWeight: '800' },
  qtyWrap: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontSize: 15, fontWeight: '800', marginHorizontal: 12 },

  couponCard: { borderRadius: 18, padding: 14, marginBottom: 8 },
  couponTitle: { fontSize: 15, fontWeight: '700', marginLeft: 8 },
  couponRow: { flexDirection: 'row', alignItems: 'center' },
  couponInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  applyBtn: {
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applied: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },

  summary: {
    padding: 18,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
  },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  divider: { height: 1, marginVertical: 8 },
  totalLabel: { fontSize: 17, fontWeight: '800' },
  totalValue: { fontSize: 20, fontWeight: '800' },
  checkoutBtn: {
    marginTop: 12,
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '700', marginRight: 8 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    elevation: 2,
  },
  emptyTitle: { fontSize: 19, fontWeight: '800' },
  shopBtn: { marginTop: 22, paddingHorizontal: 30, paddingVertical: 14, borderRadius: 14 },
  shopBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});