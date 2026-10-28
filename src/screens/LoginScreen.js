import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import FormInput from '../components/FormInput';
import { login } from '../store/authSlice';

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const users = useSelector((s) => s.auth.users);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const e = email.trim().toLowerCase();
    if (!e || !password) {
      setError('Please enter your email and password');
      return;
    }
    const user = users.find((u) => u.email === e && u.password === password);
    if (!user) {
      setError('Incorrect email or password');
      return;
    }
    dispatch(login({ email: user.email }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Ionicons name="bag-handle" size={38} color="#fff" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
          <Text style={[styles.sub, { color: colors.subtext }]}>
            Log in to continue shopping
          </Text>

          <View style={{ marginTop: 28 }}>
            <FormInput
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              value={email}
              onChangeText={(t) => { setEmail(t); setError(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormInput
              label="Password"
              icon="lock-closed-outline"
              placeholder="Your password"
              secure
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              autoCapitalize="none"
            />
          </View>

          {!!error && (
            <Text style={{ color: colors.danger, marginBottom: 10, textAlign: 'center' }}>
              {error}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={{ color: colors.subtext }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: colors.primary, fontWeight: '800' }}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  sub: { fontSize: 14, textAlign: 'center', marginTop: 6 },
  btn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
});