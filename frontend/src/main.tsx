import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { GitHubProvider } from "./context/GitHubContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GitHubProvider>
        <App />
      </GitHubProvider>
    </BrowserRouter>
  </StrictMode>,
);
