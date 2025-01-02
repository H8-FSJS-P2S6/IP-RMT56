import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux"; // Import Provider to pass down store
import store from "./redux/store"; // Import your Redux store
import "./index.css";
import App from "./App.jsx";

// Get the root element where the app will be mounted
const rootElement = document.getElementById("root");
const root = createRoot(rootElement); // Create the root using createRoot API

// Render your app with Redux Provider to make the store available throughout the app
root.render(
  <StrictMode>
    <Provider store={store}>
      {" "}
      {/* Wrap the App component with Redux Provider */}
      <App />
    </Provider>
  </StrictMode>
);
