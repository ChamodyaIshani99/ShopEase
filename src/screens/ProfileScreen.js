import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import { logout } from '../store/authSlice';
import { toggleTheme } from '../store/themeSlice';

export default function ProfileScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();

  const user = useSelector((s) => s.auth.user);
  const orderCount = useSelector(
    (s) => s.orders.list.filter((o) => o.email === user?.email).length
  );
  const wishCount = useSelector((s) => s.wishlist.items.length);

  const addr = user?.address;
  const addressText = addr ? `${addr.address}, ${addr.city}` : 'Not saved yet';

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  const Row = ({ icon, label, value, onPress, right, danger }) => {
    const tint = danger ? colors.danger : colors.primary;
    const content = (
      <>
        <View style={[styles.rowIcon, { backgroundColor: tint + '1A' }]}>
          <Ionicons name={icon} size={20} color={tint} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color: danger ? colors.danger : colors.text, fontWeight: '700', fontSize: 15 }}>
            {label}
          </Text>
          {!!value && (
            <Text numberOfLines={1} style={{ color: colors.subtext, fontSize: 12, marginTop: 2 }}>
              {value}
            </Text>
          )}
        </View>
        {right ??
          (onPress && <Ionicons name="chevron-forward" size={20} color={colors.subtext} />)}
      </>
    );

    return onPress ? (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.row, { backgroundColor: colors.card }]}
      >
        {content}
      </TouchableOpacity>
    ) : (
      <View style={[styles.row, { backgroundColor: colors.card }]}>{content}</View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <View style={styles.circleBig} />
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{orderCount}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{wishCount}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.group, { color: colors.subtext }]}>ACCOUNT</Text>
        <Row icon="receipt-outline" label="My Orders" onPress={() => navigation.navigate('Orders')} />
        <Row icon="heart-outline" label="Wishlist" onPress={() => navigation.navigate('Wishlist')} />
        <Row icon="location-outline" label="Saved address" value={addressText} />

        <Text style={[styles.group, { color: colors.subtext }]}>PREFERENCES</Text>
        <Row
          icon="moon-outline"
          label="Dark mode"
          right={
            <Switch
              value={isDark}
              onValueChange={() => dispatch(toggleTheme())}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor="#fff"
            />
          }
        />

        <Text style={[styles.group, { color: colors.subtext }]}>ADMIN</Text>
        <Row
          icon="construct-outline"
          label="Manage products"
          value="Add, edit or delete your own products"
          onPress={() => navigation.navigate('ManageProducts')}
        />

        <View style={{ marginTop: 18 }}>
          <Row icon="log-out-outline" label="Log out" danger onPress={handleLogout} />
        </View>

        <Text style={{ textAlign: 'center', color: colors.subtext, fontSize: 12, marginTop: 20 }}>
          ShopEase v1.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 24, padding: 22, alignItems: 'center', overflow: 'hidden' },
  circleBig: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 34, fontWeight: '800' },
  name: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 12 },
  email: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  stats: { flexDirection: 'row', marginTop: 18, alignItems: 'center' },
  stat: { alignItems: 'center', paddingHorizontal: 30 },
  statNum: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.4)' },
  group: { fontSize: 12, fontWeight: '800', letterSpacing: 1, marginTop: 22, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  rowIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});