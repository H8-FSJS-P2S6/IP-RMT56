import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART,
  CLEAR_CART,
} from "../actions/cartActions";

// Initial state
const initialState = {
  cart: [],
};

// Reducer function
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case UPDATE_CART:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};

export default cartReducer;
