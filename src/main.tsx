import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainPage from "./components/MainPage.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainPage />
  </StrictMode>
);
