import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function CategoryChips({ categories, selected, onSelect }) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((c) => {
        const active = c === selected;
        return (
          <TouchableOpacity
            key={c}
            onPress={() => onSelect(c)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.primary : colors.card,
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.text, { color: active ? '#fff' : colors.text }]}>
              {cap(c)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 16, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  text: { fontSize: 13, fontWeight: '600' },
});