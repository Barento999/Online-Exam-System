import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { BreadcrumbProvider } from "./context/BreadcrumbContext.jsx";
import { NotificationLoader } from "./components/layout/NotificationExample.jsx";
import { PageTransitionLoader } from "./components/common/PageTransitionLoader.jsx";
import { Toaster } from "react-hot-toast";
import { router } from "./routes.jsx";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <BreadcrumbProvider>
            <PageTransitionLoader />
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
  );
}
