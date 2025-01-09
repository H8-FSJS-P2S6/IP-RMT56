import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers/rootReducers";

// Create Redux store
const store = createStore(rootReducer, applyMiddleware());

export default store;
