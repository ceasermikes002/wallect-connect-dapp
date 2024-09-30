import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Theme } from "@radix-ui/themes";
import { WalletProvider } from "./WalletContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WalletProvider>
      <Theme>
        <App />
      </Theme>
    </WalletProvider>
  </StrictMode>
);
