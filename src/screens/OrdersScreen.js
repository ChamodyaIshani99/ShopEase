import React, { useMemo } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import { getOrderStatus } from '../utils/orderStatus';

export default function OrdersScreen({ navigation }) {
  const { colors } = useTheme();
  const user = useSelector((s) => s.auth.user);
  const list = useSelector((s) => s.orders.list);

  const orders = useMemo(
    () => list.filter((o) => o.email === user?.email),
    [list, user]
  );

  const renderItem = ({ item: order }) => {
    const status = getOrderStatus(order);
    const extra = order.items.length - 3;

    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.id, { color: colors.text }]}>{order.id}</Text>
            <Text style={{ color: colors.subtext, fontSize: 12, marginTop: 2 }}>
              {new Date(order.createdAt).toLocaleDateString()} · {order.payment}
            </Text>
          </View>
          <View style={[styles.pill, { backgroundColor: status.color + '22' }]}>
            <Ionicons name={status.icon} size={14} color={status.color} />
            <Text style={{ color: status.color, fontSize: 12, fontWeight: '700', marginLeft: 4 }}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.thumbs}>
          {order.items.slice(0, 3).map((i) => (
            <View key={i.id} style={styles.thumb}>
              <Image source={{ uri: i.image }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            </View>
          ))}
          {extra > 0 && (
            <View style={[styles.thumb, { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={{ color: colors.text, fontWeight: '800' }}>+{extra}</Text>
            </View>
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.topRow}>
          <Text style={{ color: colors.subtext }}>
            {order.items.reduce((n, i) => n + i.qty, 0)} items
          </Text>
          <Text style={{ color: colors.text, fontWeight: '800', fontSize: 16 }}>
            ${order.total.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={orders}
      keyExtractor={(o) => o.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="receipt-outline" size={44} color={colors.primary} />
          </View>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>No orders yet</Text>
          <Text style={{ color: colors.subtext, marginTop: 6, textAlign: 'center' }}>
            Your placed orders will show up here.
          </Text>
          <TouchableOpacity
            style={[styles.shopBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Start shopping</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontSize: 16, fontWeight: '800' },
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  thumbs: { flexDirection: 'row', marginTop: 14 },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 5,
    marginRight: 8,
    overflow: 'hidden',
  },
  divider: { height: 1, marginVertical: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  shopBtn: { marginTop: 20, paddingHorizontal: 28, paddingVertical: 13, borderRadius: 14 },
});