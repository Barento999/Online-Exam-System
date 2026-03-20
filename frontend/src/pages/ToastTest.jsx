import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";

export const ToastTest = () => {
  const testToasts = () => {
    // Test 1: Simple success
    toast.success("Simple success toast!");

    // Test 2: Success with custom duration
    setTimeout(() => {
      toast.success("Success with 5s duration", { duration: 5000 });
    }, 500);

    // Test 3: Error toast
    setTimeout(() => {
      toast.error("This is an error toast");
    }, 1000);

    // Test 4: Custom icon
    setTimeout(() => {
      toast.success("Welcome back, John!", {
        icon: "👋",
        duration: 4000,
      });
    }, 1500);

    // Test 5: Info toast
    setTimeout(() => {
      toast("This is an info toast", {
        icon: "ℹ️",
      });
    }, 2000);

    // Test 6: Loading toast
    setTimeout(() => {
      toast.loading("Loading...");
    }, 2500);
  };

  const testLoginToast = () => {
    toast.success(`Welcome back, Test User!`, {
      icon: "👋",
      duration: 4000,
    });
  };

  const testLogoutToast = () => {
    toast.success(`Goodbye, Test User! See you soon.`, {
      icon: "👋",
      duration: 3000,
    });
  };

  const testRegisterToast = () => {
    toast.success(`Welcome to the platform, New User! 🎉`, {
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Toast Notification Test</CardTitle>
          <CardDescription>
            Click the buttons below to test different toast notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={testToasts} variant="default">
              Test All Toasts (6 toasts)
            </Button>

            <Button onClick={testLoginToast} variant="default">
              Test Login Toast
            </Button>

            <Button onClick={testLogoutToast} variant="default">
              Test Logout Toast
            </Button>

            <Button onClick={testRegisterToast} variant="default">
              Test Register Toast
            </Button>

            <Button
              onClick={() => toast.success("Simple success!")}
              variant="outline">
              Simple Success
            </Button>

            <Button
              onClick={() => toast.error("Simple error!")}
              variant="outline">
              Simple Error
            </Button>

            <Button onClick={() => toast("Simple info!")} variant="outline">
              Simple Info
            </Button>

            <Button
              onClick={() => toast.loading("Loading...")}
              variant="outline">
              Loading Toast
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Expected Behavior:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Toasts should appear in the top-right corner</li>
              <li>
                They should be positioned 80px from the top (below navbar)
              </li>
              <li>Success toasts should have a green border</li>
              <li>Error toasts should have a red border</li>
              <li>Custom icons (👋, 🎉) should display</li>
              <li>Toasts should auto-dismiss after their duration</li>
              <li>Multiple toasts should stack vertically</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
              Troubleshooting:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
              <li>
                If you don't see toasts, press Ctrl+Shift+R to hard refresh
              </li>
              <li>Check browser console for errors (F12)</li>
              <li>
                Verify react-hot-toast is installed: npm list react-hot-toast
              </li>
              <li>Make sure Toaster component is in App.jsx</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
