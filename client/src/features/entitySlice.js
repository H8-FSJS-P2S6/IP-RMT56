import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axiosInstance";
import Swal from "sweetalert2";

const initialState = {
  items: [],
  pagination: {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  },
  groupedPokemons: [],
};

export const entitySlice = createSlice({
  name: "entity",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload.pokemons.map((list) => ({
        ...list,
        pokemons: list.pokemons || [],
      }));
      state.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.total,
        totalPages: action.payload.totalPages,
      };
    },
  },
});

export const { setItems } = entitySlice.actions;

export const fetchItems = createAsyncThunk(
  "entity/fetchItems",
  async (endpoint, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "GET",
        url: endpoint,
      });
      dispatch(setItems(data));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Failed to fetch items!",
      });
    }
  }
);

export default entitySlice.reducer;
