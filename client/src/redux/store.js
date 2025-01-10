import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import entityReducer from "../features/entitySlice";
import pokemonReducer from "../features/pokemonSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    entity: entityReducer,
    mypokemons: pokemonReducer,
  },
});

export default store;
