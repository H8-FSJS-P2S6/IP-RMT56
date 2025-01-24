https://redux-toolkit.js.org/tutorials/quick-start

npm install @reduxjs/toolkit

1. buat store di src > redux > store.js

2. Provide the Redux Store to React
   -> pastikan lokasi import store nya
   import store from "./redux/store"; // Import your Redux store

3. Create a Redux State Slice
   -> jangan lupa import createSlice nya
   yg perlu di modify: initialState
