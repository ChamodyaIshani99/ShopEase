import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import FormInput from '../components/FormInput';
import {
  clearCart, selectSubtotal, selectDiscount, selectTotal,
} from '../store/cartSlice';
import { placeOrder } from '../store/ordersSlice';
import { saveAddress } from '../store/authSlice';
import { notifyOrderPlaced } from '../utils/notifications';

const PAYMENTS = [
  { key: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' },
  { key: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
];

export default function CheckoutScreen({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const user = useSelector((s) => s.auth.user);
  const items = useSelector((s) => s.cart.items);
  const coupon = useSelector((s) => s.cart.coupon);
  const subtotal = useSelector(selectSubtotal);
  const discount = useSelector(selectDiscount);
  const total = useSelector(selectTotal);

  const saved = user?.address;
  const [form, setForm] = useState({
    fullName: saved?.fullName ?? user?.name ?? '',
    phone: saved?.phone ?? '',
    address: saved?.address ?? '',
    city: saved?.city ?? '',
  });
  const [payment, setPayment] = useState('cod');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const setCardField = (k, v) => {
    setCard((c) => ({ ...c, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onCardNumber = (t) =>
    setCardField('number', t.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim());

  const onExpiry = (t) => {
    const d = t.replace(/\D/g, '').slice(0, 4);
    setCardField('expiry', d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
  };

  const validate = () => {
    const errs = {};
    if (form.fullName.trim().length < 2) errs.fullName = 'Enter your full name';
    if (!/^\+?\d{9,12}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid phone number';
    if (form.address.trim().length < 5) errs.address = 'Enter your delivery address';
    if (form.city.trim().length < 2) errs.city = 'Enter your city';

    if (payment === 'card') {
      if (card.number.replace(/\s/g, '').length !== 16) errs.number = 'Card number must be 16 digits';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) errs.expiry = 'Use MM/YY';
      if (!/^\d{3,4}$/.test(card.cvv)) errs.cvv = 'Invalid CVV';
    }
    return errs;
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert('Cart is empty', 'Add some products first.');
      return;
    }
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPlacing(true);

    const address = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
    };

    const order = {
      id: 'ORD' + Date.now().toString().slice(-7),
      email: user.email,
      items,
      subtotal,
      discount,
      total,
      coupon,
      address,
      payment: payment === 'cod' ? 'Cash on Delivery' : 'Card',
      createdAt: Date.now(),
    };

    // Card details are never saved anywhere (demo only)
    dispatch(saveAddress(address));
    dispatch(placeOrder(order));
    dispatch(clearCart());
    notifyOrderPlaced(order.id);

    navigation.replace('OrderSuccess', { orderId: order.id, total });
  };

  const SectionTitle = ({ icon, children }) => (
    <View style={styles.sectionHead}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{children}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Address */}
          <SectionTitle icon="location-outline">Delivery address</SectionTitle>
          <FormInput
            label="Full name"
            icon="person-outline"
            value={form.fullName}
            onChangeText={(t) => setField('fullName', t)}
            error={errors.fullName}
          />
          <FormInput
            label="Phone number"
            icon="call-outline"
            placeholder="0771234567"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(t) => setField('phone', t)}
            error={errors.phone}
          />
          <FormInput
            label="Address"
            icon="home-outline"
            placeholder="House no, street"
            value={form.address}
            onChangeText={(t) => setField('address', t)}
            error={errors.address}
          />
          <FormInput
            label="City"
            icon="business-outline"
            value={form.city}
            onChangeText={(t) => setField('city', t)}
            error={errors.city}
          />

          {/* Payment */}
          <SectionTitle icon="wallet-outline">Payment method</SectionTitle>
          {PAYMENTS.map((p) => {
            const active = payment === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                activeOpacity={0.85}
                onPress={() => setPayment(p.key)}
                style={[
                  styles.payCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <View style={[styles.payIcon, { backgroundColor: colors.primary + '1A' }]}>
                  <Ionicons name={p.icon} size={22} color={colors.primary} />
                </View>
                <Text style={{ flex: 1, marginLeft: 12, color: colors.text, fontWeight: '700' }}>
                  {p.label}
                </Text>
                <Ionicons
                  name={active ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={active ? colors.primary : colors.subtext}
                />
              </TouchableOpacity>
            );
          })}

          {payment === 'card' && (
            <View style={{ marginTop: 8 }}>
              <FormInput
                label="Card number"
                icon="card-outline"
                placeholder="1234 5678 9012 3456"
                keyboardType="number-pad"
                value={card.number}
                onChangeText={onCardNumber}
                error={errors.number}
              />
              <View style={{ flexDirection: 'row' }}>
                <FormInput
                  style={{ flex: 1, marginRight: 10 }}
                  label="Expiry"
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  value={card.expiry}
                  onChangeText={onExpiry}
                  error={errors.expiry}
                />
                <FormInput
                  style={{ flex: 1 }}
                  label="CVV"
                  placeholder="123"
                  keyboardType="number-pad"
                  secure
                  value={card.cvv}
                  onChangeText={(t) => setCardField('cvv', t.replace(/\D/g, '').slice(0, 4))}
                  error={errors.cvv}
                />
              </View>
              <Text style={{ color: colors.subtext, fontSize: 12 }}>
                Demo only: card details are not stored or charged.
              </Text>
            </View>
          )}

          {/* Summary */}
          <View style={{ marginTop: 22 }}>
            <SectionTitle icon="receipt-outline">Order summary</SectionTitle>
          </View>
          <View style={[styles.summary, { backgroundColor: colors.card }]}>
            <View style={styles.sumRow}>
              <Text style={{ color: colors.subtext }}>
                Items ({items.reduce((n, i) => n + i.qty, 0)})
              </Text>
              <Text style={{ color: colors.text, fontWeight: '600' }}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.sumRow}>
              <Text style={{ color: colors.subtext }}>
                Discount{coupon ? ` (${coupon})` : ''}
              </Text>
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
              <Text style={{ color: colors.text, fontWeight: '800', fontSize: 16 }}>Total</Text>
              <Text style={{ color: colors.text, fontWeight: '800', fontSize: 18 }}>
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky place order */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 14),
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.placeBtn, { backgroundColor: colors.primary, opacity: placing ? 0.6 : 1 }]}
          onPress={handlePlaceOrder}
          disabled={placing}
          activeOpacity={0.85}
        >
          <Text style={styles.placeText}>Place Order · ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginLeft: 8 },
  payCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  payIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: { borderRadius: 18, padding: 16 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  divider: { height: 1, marginVertical: 8 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  placeBtn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  placeText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});