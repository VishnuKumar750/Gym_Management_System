import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "@/context/authProvider.tsx";
import { QueryProvider } from "@/context/QueryProvider";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import RootErrorBoundary from "@/components/ErrorBoundary/RootErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/theme/theme.provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

const queryclient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      fallback={<RootErrorBoundary />}
      onError={(error, info) => {
        // Optional but highly recommended in production:
        console.error("Root crash:", error, info.componentStack);
        // reportErrorToSentry(error, info) or similar
      }}
    >
      <QueryProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryclient}>
            <AuthProvider>
              <ThemeProvider>
                <App />
                <Toaster />
              </ThemeProvider>
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>,
);
