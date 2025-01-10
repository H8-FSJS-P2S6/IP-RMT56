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

export const PokemonSlice = createSlice({
  name: "mypokemons",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload.map((item) => ({
        id: item.id,
        userId: item.userId,
        pokemonId: item.pokemonId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        pokemon: item.pokemon,
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

export const { setItems } = PokemonSlice.actions;

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

  return {
    Authorization: `Bearer ${token}`,
    "X-User-Id": userId,
  };
};

export const fetchItems = createAsyncThunk(
  "mypokemons/fetchItems",
  async (endpoint, { dispatch }) => {
    try {
      const headers = getAuthHeaders();

      const { data } = await axios({
        method: "GET",
        url: endpoint,
        headers: headers,
      });

      console.log("Fetched data:", data);

      if (data) {
        dispatch(setItems(data));
      } else {
        console.error("Pokemons data not found in response:", data);

        dispatch(setItems([]));
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Failed to fetch items!",
      });
    }
  }
);

export const deleteItem = createAsyncThunk(
  "mypokemons/deleteItem",
  async ({ endpoint, id }, { dispatch }) => {
    try {
      const headers = getAuthHeaders();

      await axios({
        method: "DELETE",
        url: `${endpoint}/${id}`,
        headers: headers,
      });
      dispatch(fetchItems(endpoint));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Failed to delete item!",
      });
    }
  }
);

export const addItem = createAsyncThunk(
  "myfavorites/addItem",
  async ({ endpoint, newItem }, { dispatch }) => {
    try {
      const headers = getAuthHeaders();

      await axios({
        method: "POST",
        url: endpoint,
        data: newItem,
        headers: headers,
      });
      dispatch(fetchItems(endpoint));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Failed to add item!",
      });
    }
  }
);

export const updateItem = createAsyncThunk(
  "myfavorites/updateItem",
  async ({ endpoint, id, updatedItem }, { dispatch }) => {
    try {
      const headers = getAuthHeaders();

      await axios({
        method: "PUT",
        url: `${endpoint}/${id}`,
        data: updatedItem,
        headers: headers,
      });
      dispatch(fetchItems(endpoint));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Failed to update item!",
      });
    }
  }
);

export default PokemonSlice.reducer;
