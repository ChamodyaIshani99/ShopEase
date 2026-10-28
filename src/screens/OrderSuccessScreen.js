import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

export default function OrderSuccessScreen({ route, navigation }) {
  const { orderId, total } = route.params;
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark" size={64} color="#fff" />
        </Animated.View>

        <Text style={[styles.title, { color: colors.text }]}>Order placed!</Text>
        <Text style={[styles.sub, { color: colors.subtext }]}>
          Thank you for shopping with ShopEase. We'll keep you updated with notifications.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <Text style={{ color: colors.subtext }}>Order ID</Text>
            <Text style={{ color: colors.text, fontWeight: '800' }}>{orderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: colors.subtext }}>Total paid</Text>
            <Text style={{ color: colors.text, fontWeight: '800' }}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.btnText}>View my orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.border, marginTop: 10 }]}
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
        >
          <Text style={[styles.btnText, { color: colors.text }]}>Continue shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
    elevation: 6,
  },
  title: { fontSize: 28, fontWeight: '800' },
  sub: { fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 21 },
  card: { width: '100%', borderRadius: 18, padding: 16, marginTop: 28 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  btn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});