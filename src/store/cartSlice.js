import { createSlice } from '@reduxjs/toolkit';

export const COUPONS = {
  SAVE10: 10,
  SAVE20: 20,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], coupon: null },
  reducers: {
    addToCart: (state, { payload }) => {
      // payload: { product, qty }
      const { product, qty = 1 } = payload;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty,
        });
      }
    },
    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter((i) => i.id !== payload);
    },
    increaseQty: (state, { payload }) => {
      const item = state.items.find((i) => i.id === payload);
      if (item) item.qty += 1;
    },
    decreaseQty: (state, { payload }) => {
      const item = state.items.find((i) => i.id === payload);
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0) {
          state.items = state.items.filter((i) => i.id !== payload);
        }
      }
    },
    applyCoupon: (state, { payload }) => {
      state.coupon = payload; // e.g. 'SAVE10'
    },
    removeCoupon: (state) => {
      state.coupon = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartCount = (s) =>
  s.cart.items.reduce((sum, i) => sum + i.qty, 0);

export const selectSubtotal = (s) =>
  s.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

export const selectDiscount = (s) => {
  const percent = COUPONS[s.cart.coupon] || 0;
  return (selectSubtotal(s) * percent) / 100;
};

export const selectTotal = (s) => selectSubtotal(s) - selectDiscount(s);

export default cartSlice.reducer;