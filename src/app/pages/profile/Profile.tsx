import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit3, Save, X, Camera, Key, Bell, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

export function Profile() {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const [profileData, setProfileData] = useState({
    personal: {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@tapaal.com',
      phone: '+91-9876543210',
      location: 'New Delhi, India',
      department: 'Administration',
      role: 'System Administrator',
      employeeId: 'EMP001',
      joinDate: '2020-01-15'
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: true,
      lastLogin: '2024-01-20 09:30 AM',
      loginAttempts: 0
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      mailUpdates: true,
      systemAlerts: true,
      weeklyReports: false
    }
  });

  const [tempData, setTempData] = useState(profileData.personal);

  const handleEdit = () => {
    setTempData(profileData.personal);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(prev => ({
      ...prev,
      personal: tempData
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData.personal);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>
          <p className="text-gray-500">{t('profile.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {t('profile.saveChanges')}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit3 className="w-4 h-4 mr-2" />
              {t('profile.editProfile')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.personal.firstName[0]}{profileData.personal.lastName[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white border-2 border-gray-300 rounded-full p-1 shadow-sm hover:bg-gray-50">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {profileData.personal.firstName} {profileData.personal.lastName}
                </h2>
                <p className="text-gray-500">{profileData.personal.role}</p>
                <Badge className="mt-2 bg-green-100 text-green-700">Active</Badge>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{profileData.personal.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{profileData.personal.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.personal.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{t('profile.joined')} {profileData.personal.joinDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'personal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('profile.personalInformation')}
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('profile.security')}
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('profile.notifications')}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'personal' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('profile.personalInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.firstName')}</label>
                    <Input
                      value={isEditing ? tempData.firstName : profileData.personal.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? 'bg-white' : 'bg-gray-50'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.lastName')}</label>
                    <Input
                      value={isEditing ? tempData.lastName : profileData.personal.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? 'bg-white' : 'bg-gray-50'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.email')}</label>
                    <Input
                      value={isEditing ? tempData.email : profileData.personal.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? 'bg-white' : 'bg-gray-50'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.phone')}</label>
                    <Input
                      value={isEditing ? tempData.phone : profileData.personal.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? 'bg-white' : 'bg-gray-50'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.department')}</label>
                    <Input
                      value={profileData.personal.department}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.employeeId')}</label>
                    <Input
                      value={profileData.personal.employeeId}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.location')}</label>
                  <Input
                    value={isEditing ? tempData.location : profileData.personal.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? 'bg-white' : 'bg-gray-50'}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    {t('profile.changePassword')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.currentPassword')}</label>
                    <Input type="password" placeholder={t('profile.enterCurrentPassword')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.newPassword')}</label>
                    <Input type="password" placeholder={t('profile.enterNewPassword')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.confirmNewPassword')}</label>
                    <Input type="password" placeholder={t('profile.confirmNewPassword')} />
                  </div>
                  <Button>{t('profile.updatePassword')}</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {t('profile.security')} Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{t('profile.twoFactorAuth')}</p>
                      <p className="text-sm text-gray-500">{t('profile.twoFactorDescription')}</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>{t('profile.lastLogin')}:</strong> {profileData.security.lastLogin}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>{t('profile.failedLoginAttempts')}:</strong> {profileData.security.loginAttempts}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(profileData.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {key === 'emailNotifications' && 'Receive email notifications about your account activity'}
                          {key === 'pushNotifications' && 'Receive push notifications in your browser'}
                          {key === 'mailUpdates' && 'Get notified when new mails are assigned to you'}
                          {key === 'systemAlerts' && 'Receive important system alerts and updates'}
                          {key === 'weeklyReports' && 'Get weekly summary reports of your activities'}
                        </p>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${value ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${value ? 'translate-x-6' : 'translate-x-1'
                          }`}></span>
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
