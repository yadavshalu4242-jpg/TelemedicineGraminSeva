import { useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings, Bell, Lock, Download } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: 'Gramin Seva',
    adminEmail: 'admin@miaoda.com',
    maxUsersPerDay: 1000,
    enableNotifications: true,
    enableMaintenanceMode: false,
    enableAutoBackup: true,
    backupFrequency: 'daily',
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              System Settings
            </h1>
            <p className="text-muted-foreground mt-1">Configure platform-wide settings and features</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input
                    id="platform-name"
                    value={settings.platformName}
                    onChange={(e) => handleInputChange('platformName', e.target.value)}
                    placeholder="Enter platform name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    placeholder="Enter admin email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-users">Max Users Per Day</Label>
                  <Input
                    id="max-users"
                    type="number"
                    value={settings.maxUsersPerDay}
                    onChange={(e) => handleInputChange('maxUsersPerDay', parseInt(e.target.value))}
                    placeholder="Enter max users"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Enable Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Take the platform offline for maintenance</p>
                  </div>
                  <Switch
                    checked={settings.enableMaintenanceMode}
                    onCheckedChange={(checked) =>
                      handleInputChange('enableMaintenanceMode', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Enable Notifications</p>
                    <p className="text-sm text-muted-foreground">Allow system notifications</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) =>
                      handleInputChange('enableNotifications', checked)
                    }
                  />
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <p className="font-medium">Notification Types</p>
                  <div className="space-y-3">
                    {['User Registration', 'Doctor Verification Requests', 'System Alerts', 'Consultation Updates'].map((type) => (
                      <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm">{type}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="font-medium">Authentication Settings</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm">Two-Factor Authentication</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm">Enable Session Timeout</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm">Require Strong Passwords</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <p className="font-medium">Access Control</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm">Enable API Rate Limiting</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm">Log Admin Actions</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Settings */}
          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Backup & Recovery
                </CardTitle>
                <CardDescription>Configure automatic backups and data recovery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Enable Auto Backup</p>
                    <p className="text-sm text-muted-foreground">Automatically backup database daily</p>
                  </div>
                  <Switch
                    checked={settings.enableAutoBackup}
                    onCheckedChange={(checked) =>
                      handleInputChange('enableAutoBackup', checked)
                    }
                  />
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <select
                    id="backup-frequency"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    value={settings.backupFrequency}
                    onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <p className="font-medium">Last Backups</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
                      <span>Database Backup</span>
                      <span className="text-muted-foreground">Today at 02:30 AM</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
                      <span>Files Backup</span>
                      <span className="text-muted-foreground">Today at 02:00 AM</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline">Create Manual Backup</Button>
                  <Button variant="outline">Download Latest Backup</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
