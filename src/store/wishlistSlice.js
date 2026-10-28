import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {
    toggleWishlist: (state, { payload }) => {
      const exists = state.items.find((p) => p.id === payload.id);
      if (exists) {
        state.items = state.items.filter((p) => p.id !== payload.id);
      } else {
        state.items.push(payload);
      }
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;