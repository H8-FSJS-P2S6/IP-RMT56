import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { p2Api } from '../helpers/http-client';

const accessToken = localStorage.getItem('access_token');

// Fetch cart items
export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (_, thunkAPI) => {
  try {
    const response = await p2Api.get('/cart', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Add to cart
export const addToCart = createAsyncThunk('cart/addToCart', async (productId, thunkAPI) => {
  try {
    const response = await p2Api.post(
      '/cart',
      { productId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // Show Toastify notification
    toast.success(response.data.message);
    // Refetch cart items
    thunkAPI.dispatch(fetchCartItems());
    return response.data;
  } catch (error) {
    toast.error('Failed to add product to cart');
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    cartLoading: false,
    fetchLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
