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
                  },
                  success: {
                    iconTheme: {
                      primary: "#22C55E",
                      secondary: "#FFFFFF",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#EF4444",
                      secondary: "#FFFFFF",
                    },
                  },
                }}
              />
            </BreadcrumbProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
