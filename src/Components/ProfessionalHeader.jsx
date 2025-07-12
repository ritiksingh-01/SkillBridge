import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Bell, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  BarChart3
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const ProfessionalHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const profilePicUrl = !profileImageError && user?.profileImage ? user.profileImage : 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || 'User')}&background=3B82F6&color=fff`;

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Mentors', path: '/findMentorPage' },
    { icon: MessageSquare, label: 'Messages', path: '/message' },
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: notificationCount },
  ];

  if (user?.role === 'mentor') {
    navItems.splice(1, 0, { 
      icon: BarChart3, 
      label: 'Dashboard', 
      path: '/mentor-dashboard'
    });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Skill<span className="text-blue-600">Bridge</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`relative flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-2" />
                <span className="font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="hidden lg:flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-500">{isConnected ? 'Online' : 'Offline'}</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img 
                  src={profilePicUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  onError={() => setProfileImageError(true)}
                />
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium text-gray-900">{user?.firstName || 'User'}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role || 'Member'}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                    <div className="text-xs text-blue-600 capitalize font-medium mt-1">{user?.role}</div>
                  </div>
                  
                  <div className="py-1">
                    <ProfileMenuItem 
                      icon={User} 
                      text="View Profile" 
                      onClick={() => handleNavigation('/profile')} 
                    />
                    <ProfileMenuItem 
                      icon={Settings} 
                      text="Settings" 
                      onClick={() => handleNavigation('/settings')} 
                    />
                    <ProfileMenuItem 
                      icon={HelpCircle} 
                      text="Help & Support" 
                      onClick={() => handleNavigation('/help')} 
                    />
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <ProfileMenuItem 
                      icon={LogOut} 
                      text="Sign Out" 
                      onClick={handleLogout}
                      className="text-red-600 hover:bg-red-50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mobile Navigation Items */}
            {navItems.map((item) => (
              <MobileNavItem 
                key={item.path}
                icon={item.icon} 
                text={item.label} 
                active={isActive(item.path)} 
                onClick={() => handleNavigation(item.path)}
                badge={item.badge}
              />
            ))}
            
            <div className="border-t border-gray-100 pt-4 mt-4">
              <MobileNavItem 
                icon={User} 
                text="Profile" 
                active={isActive('/profile')} 
                onClick={() => handleNavigation('/profile')} 
              />
              <MobileNavItem 
                icon={Settings} 
                text="Settings" 
                active={isActive('/settings')} 
                onClick={() => handleNavigation('/settings')} 
              />
              <MobileNavItem 
                icon={LogOut} 
                text="Sign Out" 
                onClick={handleLogout}
                className="text-red-600"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const ProfileMenuItem = ({ icon: Icon, text, onClick, className = "" }) => {
  return (
    <button
      className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${className}`}
      onClick={onClick}
    >
      <Icon className="w-4 h-4 mr-3" />
      {text}
    </button>
  );
};

const MobileNavItem = ({ icon: Icon, text, active, onClick, badge, className = "" }) => {
  return (
    <button
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
        active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="relative">
          <Icon className="w-5 h-5 mr-3" />
          {badge && badge > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {badge}
            </div>
          )}
        </div>
        <span className="font-medium">{text}</span>
      </div>
    </button>
  );
};

export default ProfessionalHeader;