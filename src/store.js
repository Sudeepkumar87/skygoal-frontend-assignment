import { configureStore } from '@reduxjs/toolkit';
import authSlice from './redux/authSlice';
import productsSlice from "./redux/productsSlice";


export const store = configureStore({
  reducer: {
    products: productsSlice,
    auth: authSlice,
  },
});

export default store;
