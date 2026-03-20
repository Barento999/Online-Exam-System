import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageTransitionLoader } from "@/components/common/PageTransitionLoader";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Shield,
  Database,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const Settings = () => {
  const [settings, setSettings] = useState({
    theme: localStorage.getItem("theme") || "system",
    notifications: {
      email: true,
      push: true,
      examReminders: true,
      resultNotifications: true,
      systemUpdates: false,
    },
    privacy: {
      profileVisible: true,
      showOnlineStatus: true,
      allowDataCollection: false,
    },
  });

  const handleThemeChange = (theme) => {
    setSettings((prev) => ({ ...prev, theme }));

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      // System theme
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.removeItem("theme");
    }

    toast.success(`Theme changed to ${theme}`);
  };

  const handleNotificationChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
    toast.success("Notification preferences updated");
  };

  const handlePrivacyChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
    toast.success("Privacy settings updated");
  };

  const clearAllData = () => {
    if (
      confirm(
        "Are you sure you want to clear all local data? This action cannot be undone.",
      )
    ) {
      localStorage.clear();
      toast.success("All local data cleared");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageTransitionLoader />
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and account settings
        </p>
      </div>

      <div className="grid gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Theme</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Choose your preferred theme for the application
              </p>
              <div className="flex gap-2">
                <Button
                  variant={settings.theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("light")}
                  className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={settings.theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("dark")}
                  className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={settings.theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("system")}
                  className="flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.notifications.email}
                onCheckedChange={(checked) =>
                  handleNotificationChange("email", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.notifications.push}
                onCheckedChange={(checked) =>
                  handleNotificationChange("push", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="exam-reminders">Exam Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded about upcoming exams
                </p>
              </div>
              <Switch
                id="exam-reminders"
                checked={settings.notifications.examReminders}
                onCheckedChange={(checked) =>
                  handleNotificationChange("examReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="result-notifications">
                  Result Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when exam results are available
                </p>
              </div>
              <Switch
                id="result-notifications"
                checked={settings.notifications.resultNotifications}
                onCheckedChange={(checked) =>
                  handleNotificationChange("resultNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="system-updates">System Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about system updates and maintenance
                </p>
              </div>
              <Switch
                id="system-updates"
                checked={settings.notifications.systemUpdates}
                onCheckedChange={(checked) =>
                  handleNotificationChange("systemUpdates", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profile-visible">Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Make your profile visible to other users
                </p>
              </div>
              <Switch
                id="profile-visible"
                checked={settings.privacy.profileVisible}
                onCheckedChange={(checked) =>
                  handlePrivacyChange("profileVisible", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="online-status">Show Online Status</Label>
                <p className="text-sm text-muted-foreground">
                  Let others see when you're online
                </p>
              </div>
              <Switch
                id="online-status"
                checked={settings.privacy.showOnlineStatus}
                onCheckedChange={(checked) =>
                  handlePrivacyChange("showOnlineStatus", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-collection">Allow Data Collection</Label>
                <p className="text-sm text-muted-foreground">
                  Help improve the app by sharing anonymous usage data
                </p>
              </div>
              <Switch
                id="data-collection"
                checked={settings.privacy.allowDataCollection}
                onCheckedChange={(checked) =>
                  handlePrivacyChange("allowDataCollection", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">
                  Clear Local Data
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Remove all locally stored data including preferences and cache
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearAllData}
                  className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
