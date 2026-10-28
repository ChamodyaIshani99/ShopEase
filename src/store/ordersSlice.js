import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: [] },
  reducers: {
    placeOrder: (state, { payload }) => {
      state.list.unshift(payload);
    },
  },
});

export const { placeOrder } = ordersSlice.actions;
export default ordersSlice.reducer;