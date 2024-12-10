import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider";
import * as serviceWorkerRegistration from "../src/serviceWorkerRegistration.js";
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
serviceWorkerRegistration.register();
