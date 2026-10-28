import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  name: 'products',
  initialState: { custom: [] },
  reducers: {
    addProduct: (state, { payload }) => {
      state.custom.unshift(payload);
    },
    updateProduct: (state, { payload }) => {
      const i = state.custom.findIndex((p) => p.id === payload.id);
      if (i !== -1) state.custom[i] = payload;
    },
    deleteProduct: (state, { payload }) => {
      state.custom = state.custom.filter((p) => p.id !== payload);
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;