import React from 'react';
import { View, Text } from 'react-native';
import useTheme from '../hooks/useTheme';

export default function Placeholder({ route }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>
        {route.name} screen (coming next)
      </Text>
    </View>
  );
}