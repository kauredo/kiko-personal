import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const hasGa = !!loadEnv(mode, process.cwd(), "VITE_").VITE_GA_MEASUREMENT_ID;
  return {
    server: { port: 4031 },
    plugins: [
      react(),
      tailwindcss(),
      {
        // Vite leaves %VITE_GA_MEASUREMENT_ID% as literal text when the variable is unset
        name: "strip-ga-without-id",
        transformIndexHtml: {
          order: "pre",
          handler: (html) =>
            hasGa ? html : html.replace(/<!--ga-start-->[\s\S]*?<!--ga-end-->\n?/, ""),
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
