import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { BreadcrumbProvider } from "./context/BreadcrumbContext.jsx";
import { NotificationLoader } from "./components/layout/NotificationExample.jsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary.jsx";
import { Toaster } from "react-hot-toast";
import { router } from "./routes.jsx";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <BreadcrumbProvider>
              <NotificationLoader />
              <RouterProvider router={router} />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "var(--card)",
                    color: "var(--card-foreground)",
                    border: "1px solid var(--border)",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    maxWidth: "420px",
                  },
                  success: {
                    iconTheme: {
                      primary: "#22C55E",
                      secondary: "#FFFFFF",
                    },
                    style: {
                      border: "1px solid #22C55E",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#EF4444",
                      secondary: "#FFFFFF",
                    },
                    style: {
                      border: "1px solid #EF4444",
                    },
                  },
                }}
                containerStyle={{
                  top: 80,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
                containerClassName="toast-container"
              />
            </BreadcrumbProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
