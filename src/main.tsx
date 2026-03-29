import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { LenisProvider } from "@/context/LenisContext";
import { App } from "@/App";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <LenisProvider>
        <App />
        <Analytics />
      </LenisProvider>
    </ThemeProvider>
  </StrictMode>,
);
