import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux"; // Import Provider to pass down store
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./redux/store"; // Import your Redux store
import "./index.css";
import App from "./App.jsx";

// Get the root element where the app will be mounted
const rootElement = document.getElementById("root");
const root = createRoot(rootElement); // Create the root using createRoot API

const CLIENT_ID =
  "556557064228-oombqsf1bt1j7bujfaps2bfgqlr97eih.apps.googleusercontent.com";

// Render your app with Redux Provider to make the store available throughout the app
root.render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);
