import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, users: [] },
  reducers: {
    register: (state, { payload }) => {
      // payload: { name, email, password }
      state.users.push(payload);
      state.user = { name: payload.name, email: payload.email };
    },
    login: (state, { payload }) => {
      // payload: { email }
      const u = state.users.find((x) => x.email === payload.email);
      if (u) state.user = { name: u.name, email: u.email, address: u.address };
    },
    saveAddress: (state, { payload }) => {
      if (!state.user) return;
      state.user.address = payload;
      const u = state.users.find((x) => x.email === state.user.email);
      if (u) u.address = payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { register, login, saveAddress, logout } = authSlice.actions;
export default authSlice.reducer;