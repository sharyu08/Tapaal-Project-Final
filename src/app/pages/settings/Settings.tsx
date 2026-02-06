import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings as SettingsIcon,
  Database,
  Mail,
  Shield,
  Bell,
  Globe,
  Palette,
  Users,
  Clock,
  Download,
  Upload,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

export function Settings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    general: {
      siteName: 'Tapaal Management System',
      siteDescription: 'Efficient mail and document management system',
      adminEmail: 'admin@tapaal.com',
      timezone: 'Asia/Kolkata',
      language: 'English',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24-hour',
      itemsPerPage: 10,
      sessionTimeout: 30
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'noreply@tapaal.com',
      smtpPassword: '••••••••',
      emailFromName: 'Tapaal System',
      emailFromAddress: 'noreply@tapaal.com',
      enableSsl: true,
      enableNotifications: true
    },
    security: {
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSpecialChars: true,
      sessionTimeoutMinutes: 30,
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 15,
      enableTwoFactor: false
    },
    system: {
      enableMaintenance: false,
      maintenanceMessage: 'System is under maintenance. Please try again later.',
      enableBackup: true,
      backupFrequency: 'daily',
      backupRetentionDays: 30,
      enableLogging: true,
      logLevel: 'info',
      maxFileSize: 10485760
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      newMailAlert: true,
      statusChangeAlert: true,
      deadlineReminder: true,
      systemAlerts: true,
      weeklyReports: true
    }
  });

  const [tempSettings, setTempSettings] = useState(settings);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setTempSettings(settings);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSettings(tempSettings);
    setSaving(false);
  };

  const handleReset = () => {
    setTempSettings(settings);
  };

  const handleInputChange = (category: string, field: string, value: any) => {
    setTempSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t('settings.basicSettings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.siteName')}</label>
              <Input
                value={tempSettings.general.siteName}
                onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.adminEmail')}</label>
              <Input
                type="email"
                value={tempSettings.general.adminEmail}
                onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.timezone')}</label>
              <select
                value={tempSettings.general.timezone}
                onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={tempSettings.general.language}
                onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
              <select
                value={tempSettings.general.dateFormat}
                onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
              <select
                value={tempSettings.general.timeFormat}
                onChange={(e) => handleInputChange('general', 'timeFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="24-hour">24-hour</option>
                <option value="12-hour">12-hour</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
            <textarea
              value={tempSettings.general.siteDescription}
              onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Display Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Items Per Page</label>
              <Input
                type="number"
                value={tempSettings.general.itemsPerPage}
                onChange={(e) => handleInputChange('general', 'itemsPerPage', parseInt(e.target.value))}
                min="5"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
              <Input
                type="number"
                value={tempSettings.general.sessionTimeout}
                onChange={(e) => handleInputChange('general', 'sessionTimeout', parseInt(e.target.value))}
                min="5"
                max="480"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            SMTP Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
              <Input
                value={tempSettings.email.smtpHost}
                onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
              <Input
                type="number"
                value={tempSettings.email.smtpPort}
                onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
              <Input
                value={tempSettings.email.smtpUsername}
                onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
              <Input
                type="password"
                value={tempSettings.email.smtpPassword}
                onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
              <Input
                value={tempSettings.email.emailFromName}
                onChange={(e) => handleInputChange('email', 'emailFromName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Address</label>
              <Input
                type="email"
                value={tempSettings.email.emailFromAddress}
                onChange={(e) => handleInputChange('email', 'emailFromAddress', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={tempSettings.email.enableSsl}
                onChange={(e) => handleInputChange('email', 'enableSsl', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Enable SSL/TLS</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={tempSettings.email.enableNotifications}
                onChange={(e) => handleInputChange('email', 'enableNotifications', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Enable Email Notifications</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Email Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Send Test Email
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Password Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
              <Input
                type="number"
                value={tempSettings.security.passwordMinLength}
                onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                min="6"
                max="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
              <Input
                type="number"
                value={tempSettings.security.maxLoginAttempts}
                onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                min="3"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
              <Input
                type="number"
                value={tempSettings.security.sessionTimeoutMinutes}
                onChange={(e) => handleInputChange('security', 'sessionTimeoutMinutes', parseInt(e.target.value))}
                min="5"
                max="480"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lockout Duration (minutes)</label>
              <Input
                type="number"
                value={tempSettings.security.lockoutDurationMinutes}
                onChange={(e) => handleInputChange('security', 'lockoutDurationMinutes', parseInt(e.target.value))}
                min="5"
                max="1440"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={tempSettings.security.passwordRequireUppercase}
                onChange={(e) => handleInputChange('security', 'passwordRequireUppercase', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Require Uppercase Letters</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={tempSettings.security.passwordRequireLowercase}
                onChange={(e) => handleInputChange('security', 'passwordRequireLowercase', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Require Lowercase Letters</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={tempSettings.security.passwordRequireNumbers}
                onChange={(e) => handleInputChange('security', 'passwordRequireNumbers', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Require Numbers</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={tempSettings.security.passwordRequireSpecialChars}
                onChange={(e) => handleInputChange('security', 'passwordRequireSpecialChars', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Require Special Characters</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={tempSettings.security.enableTwoFactor}
                onChange={(e) => handleInputChange('security', 'enableTwoFactor', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</span>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
              <select
                value={tempSettings.system.backupFrequency}
                onChange={(e) => handleInputChange('system', 'backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backup Retention (days)</label>
              <Input
                type="number"
                value={tempSettings.system.backupRetentionDays}
                onChange={(e) => handleInputChange('system', 'backupRetentionDays', parseInt(e.target.value))}
                min="7"
                max="365"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Log Level</label>
              <select
                value={tempSettings.system.logLevel}
                onChange={(e) => handleInputChange('system', 'logLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max File Size (bytes)</label>
              <Input
                type="number"
                value={tempSettings.system.maxFileSize}
                onChange={(e) => handleInputChange('system', 'maxFileSize', parseInt(e.target.value))}
                min="1024"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={tempSettings.system.enableMaintenance}
                onChange={(e) => handleInputChange('system', 'enableMaintenance', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Enable Maintenance Mode</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={tempSettings.system.enableBackup}
                onChange={(e) => handleInputChange('system', 'enableBackup', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Enable Automatic Backup</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={tempSettings.system.enableLogging}
                onChange={(e) => handleInputChange('system', 'enableLogging', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Enable System Logging</span>
            </label>
          </div>
          {tempSettings.system.enableMaintenance && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
              <textarea
                value={tempSettings.system.maintenanceMessage}
                onChange={(e) => handleInputChange('system', 'maintenanceMessage', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export System Data
            </Button>
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Import System Data
            </Button>
            <Button variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
            <Button variant="outline" className="w-full">
              <Database className="w-4 h-4 mr-2" />
              Optimize Database
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Object.entries(tempSettings.notifications).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {key === 'emailNotifications' && 'Send notifications via email'}
                    {key === 'pushNotifications' && 'Send push notifications to browser'}
                    {key === 'smsNotifications' && 'Send notifications via SMS'}
                    {key === 'newMailAlert' && 'Alert when new mail is received'}
                    {key === 'statusChangeAlert' && 'Alert when mail status changes'}
                    {key === 'deadlineReminder' && 'Send deadline reminders'}
                    {key === 'systemAlerts' && 'Send system alerts and updates'}
                    {key === 'weeklyReports' && 'Send weekly summary reports'}
                  </p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  onClick={() => handleInputChange('notifications', key, !value)}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${value ? 'translate-x-6' : 'translate-x-1'
                    }`}></span>
                </button>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'general', label: t('settings.general'), icon: SettingsIcon },
    { id: 'email', label: t('settings.email'), icon: Mail },
    { id: 'security', label: t('settings.security'), icon: Shield },
    { id: 'system', label: t('settings.system'), icon: Database },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
          <p className="text-gray-500">{t('settings.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('common.reset')}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? t('settings.saving') : t('settings.saveChanges')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'email' && renderEmailSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'system' && renderSystemSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
        </div>
      </div>

      {/* Status Messages */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Saving settings...
        </div>
      )}
    </div>
  );
}
