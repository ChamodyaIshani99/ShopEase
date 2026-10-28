import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cart from './cartSlice';
import wishlist from './wishlistSlice';
import auth from './authSlice';
import orders from './ordersSlice';
import theme from './themeSlice';
import products from './productsSlice';

const STORAGE_KEY = 'shopease_state_v1';

const combined = combineReducers({ cart, wishlist, auth, orders, theme, products });

const rootReducer = (state, action) => {
  if (action.type === 'HYDRATE') {
    // Start from each slice's default state, then overlay saved data,
    // so missing fields (like auth.users) always exist.
    const fresh = combined(undefined, { type: '@@INIT' });
    const merged = {};
    Object.keys(fresh).forEach((key) => {
      merged[key] = { ...fresh[key], ...(action.payload?.[key] || {}) };
    });
    return merged;
  }
  return combined(state, action);
};

export const store = configureStore({ reducer: rootReducer });

export const loadPersistedState = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) store.dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) });
  } catch (e) {
    console.warn('Could not load saved state', e);
  }
};

export const startPersisting = () => {
  store.subscribe(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState())).catch(() => {});
  });
};
