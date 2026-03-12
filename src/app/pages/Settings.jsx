import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    examReminders: true,
    resultNotifications: true,
    darkMode: false,
    twoFactorAuth: false,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    toast.success('Settings updated');
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your account
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="examReminders">Exam Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified before exams start
                </p>
              </div>
              <Switch
                id="examReminders"
                checked={settings.examReminders}
                onCheckedChange={() => handleToggle('examReminders')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="resultNotifications">Result Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when results are published
                </p>
              </div>
              <Switch
                id="resultNotifications"
                checked={settings.resultNotifications}
                onCheckedChange={() => handleToggle('resultNotifications')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={() => handleToggle('twoFactorAuth')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
