import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

export default function FormInput({ label, icon, error, secure, style, ...props }) {
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={[{ marginBottom: 14 }, style]}>
      {!!label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View
        style={[
          styles.box,
          { backgroundColor: colors.card, borderColor: error ? colors.danger : colors.border },
        ]}
      >
        {!!icon && <Ionicons name={icon} size={20} color={colors.subtext} />}
        <TextInput
          {...props}
          secureTextEntry={hidden}
          placeholderTextColor={colors.subtext}
          style={[styles.input, { color: colors.text }]}
        />
        {secure && (
          <TouchableOpacity onPress={() => setHidden((h) => !h)}>
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.subtext}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15 },
  error: { fontSize: 12, marginTop: 5 },
});