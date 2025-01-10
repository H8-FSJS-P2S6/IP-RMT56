import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axiosInstance";

export const fetchItems = createAsyncThunk(
  "entity1/fetchItems",
  async (endpoint, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoint);
      console.log("API response data: ", response.data);
      return {
        pokemons: response.data.pokemons || [],
        page: response.data.page,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const entitySlice1 = createSlice({
  name: "entity1",
  initialState: {
    items: [],
    pagination: {
      page: 1,
      totalPages: 1,
    },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.monsters;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default entitySlice1.reducer;
