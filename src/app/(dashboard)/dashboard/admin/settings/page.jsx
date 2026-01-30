// ===== src/app/(dashboard)/dashboard/admin/settings/page.jsx =====
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Lock, Database, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { settingsApi } from '@/lib/api/settings';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsFetching(true);
      const data = await settingsApi.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setIsFetching(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleUpdateSettings = async (updatedData) => {
    try {
      setIsLoading(true);
      const updated = await settingsApi.updateSettings(updatedData);
      setSettings(updated);
      showMessage('success', 'Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      showMessage('error', 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupDatabase = async () => {
    try {
      setIsLoading(true);
      await settingsApi.backupDatabase();
      showMessage('success', 'Database backup initiated successfully!');
    } catch (error) {
      console.error('Error backing up database:', error);
      showMessage('error', 'Failed to backup database');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setIsLoading(true);
      await settingsApi.clearCache();
      showMessage('success', 'Cache cleared successfully!');
    } catch (error) {
      console.error('Error clearing cache:', error);
      showMessage('error', 'Failed to clear cache');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemLogs = () => {
    showMessage('info', 'Opening system logs... (Feature coming soon)');
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Manage system settings</p>
      </div>

      {message.text && (
        <Alert className={
          message.type === 'success' ? 'border-green-500 bg-green-50' : 
          message.type === 'error' ? 'border-red-500 bg-red-50' :
          'border-blue-500 bg-blue-50'
        }>
          <AlertCircle className={`h-4 w-4 ${
            message.type === 'success' ? 'text-green-600' : 
            message.type === 'error' ? 'text-red-600' :
            'text-blue-600'
          }`} />
          <AlertDescription className={
            message.type === 'success' ? 'text-green-800' : 
            message.type === 'error' ? 'text-red-800' :
            'text-blue-800'
          }>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">School Name</label>
              <Input
                value={settings.school_name}
                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Academic Year</label>
              <Input
                value={settings.academic_year}
                onChange={(e) => setSettings({ ...settings, academic_year: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Current Term</label>
              <Input
                value={settings.current_term}
                onChange={(e) => setSettings({ ...settings, current_term: e.target.value })}
                className="mt-2"
              />
            </div>
            <Button 
              onClick={() => handleUpdateSettings({
                school_name: settings.school_name,
                academic_year: settings.academic_year,
                current_term: settings.current_term,
              })}
              disabled={isLoading}
              className="w-full mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update General Settings'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label htmlFor="email-notifications" className="text-base">
                  Email Notifications
                </Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.email_notifications_enabled}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, email_notifications_enabled: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label htmlFor="sms-notifications" className="text-base">
                  SMS Notifications
                </Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via SMS
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={settings.sms_notifications_enabled}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, sms_notifications_enabled: checked })
                }
              />
            </div>

            <Button 
              onClick={() => handleUpdateSettings({
                email_notifications_enabled: settings.email_notifications_enabled,
                sms_notifications_enabled: settings.sms_notifications_enabled,
              })}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Notification Settings'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label htmlFor="two-factor-auth" className="text-base">
                  Two-Factor Authentication
                </Label>
                <p className="text-sm text-gray-500">
                  Require 2FA for all admin accounts
                </p>
              </div>
              <Switch
                id="two-factor-auth"
                checked={settings.two_factor_auth_required}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, two_factor_auth_required: checked })
                }
              />
            </div>
            
            <div>
              <Label htmlFor="password-expiry" className="text-base">
                Password Expiry
              </Label>
              <p className="text-sm text-gray-500 mb-3">
                Number of days before passwords must be changed
              </p>
              <div className="flex items-center gap-4">
                <Input
                  id="password-expiry"
                  type="number"
                  min="0"
                  max="365"
                  value={settings.password_expiry_days}
                  onChange={(e) => 
                    setSettings({ ...settings, password_expiry_days: parseInt(e.target.value) || 0 })
                  }
                  className="w-32"
                />
                <span className="text-sm text-gray-600">days</span>
              </div>
            </div>

            <Button 
              onClick={() => handleUpdateSettings({
                two_factor_auth_required: settings.two_factor_auth_required,
                password_expiry_days: settings.password_expiry_days,
              })}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Security'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              onClick={handleBackupDatabase}
              disabled={isLoading}
              variant="outline" 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Backup Database'
              )}
            </Button>
            <Button 
              onClick={handleClearCache}
              disabled={isLoading}
              variant="outline" 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                'Clear Cache'
              )}
            </Button>
            <Button 
              onClick={handleSystemLogs}
              variant="outline" 
              className="w-full text-red-600 hover:text-red-700"
            >
              System Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
