import React, { useState } from 'react';
import { 
  Bell, 
  Lock, 
  User, 
  Monitor, 
  ChevronDown, 
  Check, 
  LogOut,
  Calendar,
  MapPin,
  Globe,
  Menu,
  X,
  Search,
  Shield,
  Eye,
  Download,
  Trash2,
  Languages,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react';
import Footer from '../../Components/Footer';
import Header from '../../Components/Header';

const SettingPage = () => {
  // Initialize all sections as collapsed
  const [collapsedSections, setCollapsedSections] = useState({
    notifications: true,
    security: true,
    profile: true,
    appearance: true,
    privacy: true,
    devices: true
  });
  
  const [notifications, setNotifications] = useState({
    newsletter: true,
    emailNotifications: true,
    jobNotifications: false,
    pushNotifications: true,
    smsNotifications: false
  });
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleNotificationToggle = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handlePasswordSubmit = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      alert('Please fill in all password fields');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New passwords do not match');
      return;
    }
    alert('Password updated successfully!');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleLogoutAllDevices = () => {
    if (window.confirm('Are you sure you want to log out from all devices? You will need to log in again on all devices.')) {
      alert('Logged out from all devices');
    }
  };

  const handleLogoutDevice = () => {
    if (window.confirm('Are you sure you want to log out from this device?')) {
      alert('Device logged out successfully');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion process initiated. You will receive an email with further instructions.');
    }
  };

  const handleDownloadData = () => {
    alert('Your data download will be ready shortly. You will receive an email when it\'s available.');
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className={`w-14 h-8 rounded-full transition-colors duration-300 ${
        checked ? 'bg-indigo-600' : 'bg-gray-300'
      }`}>
        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-1 ${
          checked ? 'translate-x-7 ml-1' : 'translate-x-1'
        }`} />
      </div>
    </label>
  );

  const Section = ({ id, title, icon: Icon, children }) => {
    const isCollapsed = collapsedSections[id];
    
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100">
        <div 
          className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 p-6 border-b border-gray-200 cursor-pointer transition-all duration-300"
          onClick={() => toggleSection(id)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
              <Icon className="w-6 h-6 text-indigo-600" />
              {title}
            </h2>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
              isCollapsed ? '-rotate-90' : ''
            }`} />
          </div>
        </div>
        <div className={`transition-all duration-300 overflow-hidden ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
        }`}>
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-4 mt-20">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Settings</h1>
          <p className="text-gray-600 text-lg">Manage your SkillBridge account preferences and security</p>
        </div>

        <div className="space-y-8">
          {/* Notifications Section */}
          <Section id="notifications" title="Notifications" icon={Bell}>
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Newsletter Preference</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Get access to the latest updates regarding hiring challenges of top recruiters (like Walmart, Flipkart, Uber, Amazon, etc.), jobs & internships, competitions, quizzes, and hackathons from elite colleges across the world.
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.newsletter}
                  onChange={() => handleNotificationToggle('newsletter')}
                />
              </div>

              <div className="flex justify-between items-start border-t border-gray-100 pt-8">
                <div className="flex-1 mr-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Email Notification Preferences</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Automated reminders for incomplete registration, daily quiz and hackathon reminders, submission reminders, and review reminders.
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.emailNotifications}
                  onChange={() => handleNotificationToggle('emailNotifications')}
                />
              </div>

              <div className="flex justify-between items-start border-t border-gray-100 pt-8">
                <div className="flex-1 mr-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Job Notifications</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Get notified about job opportunities that match your skills and preferences.
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.jobNotifications}
                  onChange={() => handleNotificationToggle('jobNotifications')}
                />
              </div>

              <div className="flex justify-between items-start border-t border-gray-100 pt-8">
                <div className="flex-1 mr-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Push Notifications</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Receive browser push notifications for important updates and messages.
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.pushNotifications}
                  onChange={() => handleNotificationToggle('pushNotifications')}
                />
              </div>

              <div className="flex justify-between items-start border-t border-gray-100 pt-8">
                <div className="flex-1 mr-6">
                  <h3 className="font-semibold text-gray-800 mb-2">SMS Notifications</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Receive text messages for critical account updates and security alerts.
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.smsNotifications}
                  onChange={() => handleNotificationToggle('smsNotifications')}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 text-sm italic">
                  💡 You can turn off automated email notifications for specific opportunities from 'My Registrations/Applications'.
                </p>
              </div>
            </div>
          </Section>

          {/* Security Section */}
          <Section id="security" title="Security" icon={Shield}>
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                </div>
                <ToggleSwitch
                  checked={twoFactorAuth}
                  onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                />
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Change Password</h3>
                <p className="text-gray-600 mb-6">If you wish to change your password, you can change it from here.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter current password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-100 transition-all duration-300"
                      placeholder="Current password"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter new password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-100 transition-all duration-300"
                        placeholder="New password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-100 transition-all duration-300"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordSubmit}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </Section>

          {/* Profile Section */}
          <Section id="profile" title="Profile" icon={User}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile Visibility
                </label>
                <p className="text-gray-600 mb-4 text-sm">
                  You can choose to make your profile public (searchable on Google) or private (hidden from search engines).
                </p>
                <select
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-100 transition-all duration-300"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </Section>

          {/* Appearance Section */}
          <Section id="appearance" title="Appearance" icon={Eye}>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-6">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    Dark Mode
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Switch between light and dark themes for a more comfortable viewing experience.
                  </p>
                </div>
                <ToggleSwitch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              </div>

              <div className="border-t border-gray-100 pt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Languages className="w-4 h-4 inline mr-2" />
                  Language
                </label>
                <p className="text-gray-600 mb-4 text-sm">
                  Choose your preferred language for the interface.
                </p>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-100 transition-all duration-300"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </Section>

          {/* Data & Privacy Section */}
          <Section id="privacy" title="Data & Privacy" icon={Lock}>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Data Management</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Manage your personal data and privacy settings.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleDownloadData}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 justify-center"
                  >
                    <Download className="w-4 h-4" />
                    Download My Data
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Account deletion is permanent and cannot be undone. All your data will be permanently removed.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Manage Devices Section */}
          <Section id="devices" title="Manage Devices" icon={Monitor}>
            <div className="space-y-6">
              <p className="text-gray-600">You are currently logged in on all the following devices.</p>
              
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-800">All logged in devices (2)</h4>
                <button
                  onClick={handleLogoutAllDevices}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log out from all devices
                </button>
              </div>

              <div className="space-y-4">
                {/* Current Device */}
                <div className="bg-gray-50 hover:bg-gray-100 p-6 rounded-xl transition-all duration-300 border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Monitor className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-800">Windows</h4>
                          <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            This Device
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Jun 25, 01:16 PM IST
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Agra, Uttar Pradesh, India, IN
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Chrome 137.0.0.0
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Device */}
                <div className="bg-gray-50 hover:bg-gray-100 p-6 rounded-xl transition-all duration-300 border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Mobile Device</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Jun 25, 02:03 PM IST
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Agra, Uttar Pradesh, India, IN
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Safari Mobile
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogoutDevice}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default SettingPage;