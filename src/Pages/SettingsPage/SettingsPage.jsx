import React, { useState } from 'react';
import { 
  Lock, 
  Bell, 
  Shield, 
  Check, 
  AlertCircle, 
  Save, 
  User, 
  Globe 
} from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('security');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  // Notification toggles
  const [notifications, setNotifications] = useState({
    sessionReminders: true,
    chatMessages: true,
    marketingEmails: false,
    systemUpdates: true
  });
  const [savedSettings, setSavedSettings] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdSuccess('');
    setPwdError('');

    if (!currentPassword || !newPassword) {
      setPwdError('Please enter both your current password and a new password.');
      return;
    }

    if (newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    try {
      setPwdLoading(true);
      await authAPI.changePassword({ currentPassword, newPassword });
      setPwdSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account credentials, notifications, and security preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Settings Sidebar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 h-fit">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span>Security & Password</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'preferences' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span>Preferences</span>
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="md:col-span-3 space-y-6">
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                </div>

                {pwdSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center space-x-2 text-sm">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>{pwdSuccess}</span>
                  </div>
                )}

                {pwdError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{pwdError}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password (minimum 8 characters)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      placeholder="••••••••"
                      minLength={8}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      placeholder="••••••••"
                      minLength={8}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
                  >
                    {pwdLoading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>

                <hr className="my-8 border-gray-200" />

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">Account Details</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium text-gray-700">Account Type:</span> <span className="capitalize">{user?.role || 'User'}</span></p>
                    <p><span className="font-medium text-gray-700">Email Address:</span> {user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                </div>

                {savedSettings && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center space-x-2 text-sm">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>Preferences saved successfully!</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Session Reminders</h4>
                      <p className="text-xs text-gray-500">Get notified before scheduled mentorship sessions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.sessionReminders}
                      onChange={() => handleToggle('sessionReminders')}
                      className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">New Messages</h4>
                      <p className="text-xs text-gray-500">Receive alerts when mentees or mentors send you chat messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.chatMessages}
                      onChange={() => handleToggle('chatMessages')}
                      className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">System & Account Updates</h4>
                      <p className="text-xs text-gray-500">Essential account notifications and security alerts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.systemUpdates}
                      onChange={() => handleToggle('systemUpdates')}
                      className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    className="mt-4 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Regional & Display Preferences</h2>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+5:30)</option>
                      <option value="America/New_York">America/New_York (EST - UTC-5:00)</option>
                      <option value="Europe/London">Europe/London (GMT - UTC+0:00)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST - UTC-8:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="en">English (US)</option>
                      <option value="hi">Hindi (हिंदी)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SettingsPage;

