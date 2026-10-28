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
import { register } from '../store/authSlice';

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const users = useSelector((s) => s.auth.users) || [];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});

  const handleRegister = () => {
    const errs = {};
    const e = email.trim().toLowerCase();

    if (name.trim().length < 2) errs.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(e)) errs.email = 'Enter a valid email address';
    else if (users.some((u) => u.email === e)) errs.email = 'This email is already registered';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (confirm !== password) errs.confirm = 'Passwords do not match';

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    dispatch(register({ name: name.trim(), email: e, password }));
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.back, { backgroundColor: colors.card }]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
          <Text style={[styles.sub, { color: colors.subtext }]}>
            Sign up to start shopping with ShopEase
          </Text>

          <View style={{ marginTop: 26 }}>
            <FormInput
              label="Full name"
              icon="person-outline"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            <FormInput
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <FormInput
              label="Password"
              icon="lock-closed-outline"
              placeholder="At least 6 characters"
              secure
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              error={errors.password}
            />
            <FormInput
              label="Confirm password"
              icon="shield-checkmark-outline"
              placeholder="Repeat password"
              secure
              value={confirm}
              onChangeText={setConfirm}
              autoCapitalize="none"
              error={errors.confirm}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={{ color: colors.subtext }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: colors.primary, fontWeight: '800' }}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    elevation: 2,
  },
  title: { fontSize: 28, fontWeight: '800' },
  sub: { fontSize: 14, marginTop: 6 },
  btn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22, marginBottom: 10 },
});