import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import { deleteProduct } from '../store/productsSlice';

export default function ManageProductsScreen({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const items = useSelector((s) => s.products.custom);

  const confirmDelete = (p) => {
    Alert.alert('Delete product', `Delete "${p.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteProduct(p.id)) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={items}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 100, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Ionicons name="cube-outline" size={44} color={colors.primary} />
            </View>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>
              No custom products yet
            </Text>
            <Text style={{ color: colors.subtext, marginTop: 6, textAlign: 'center' }}>
              Tap the + button to add your first product. It will appear on the Home screen.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.imgBox}>
              <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text numberOfLines={2} style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>
                {item.title}
              </Text>
              <Text style={{ color: colors.subtext, fontSize: 12, marginTop: 3 }}>
                {item.category}
              </Text>
              <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 16, marginTop: 4 }}>
                ${item.price.toFixed(2)}
              </Text>
            </View>
            <View style={{ justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[styles.smallBtn, { backgroundColor: colors.primary + '1A' }]}
                onPress={() => navigation.navigate('ProductForm', { product: item })}
              >
                <Ionicons name="create-outline" size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallBtn, { backgroundColor: colors.danger + '1A' }]}
                onPress={() => confirmDelete(item)}
              >
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ProductForm')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, borderRadius: 18, marginBottom: 12, elevation: 2 },
  imgBox: { width: 80, height: 80, backgroundColor: '#fff', borderRadius: 14, padding: 6 },
  smallBtn: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
});