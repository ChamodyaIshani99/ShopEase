import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cart from './cartSlice';
import wishlist from './wishlistSlice';
import auth from './authSlice';
import orders from './ordersSlice';
import theme from './themeSlice';

const STORAGE_KEY = 'shopease_state_v1';

const combined = combineReducers({ cart, wishlist, auth, orders, theme });

const rootReducer = (state, action) =>
  action.type === 'HYDRATE' ? { ...state, ...action.payload } : combined(state, action);

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
