import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { p2Api } from '../helpers/http-client';

// Thunk untuk fetch products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ q, brand, type }, { rejectWithValue }) => {
    try {
      const response = await p2Api.get('/products', {
        params: { q, brand, type },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching products");
    }
  }
);

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
