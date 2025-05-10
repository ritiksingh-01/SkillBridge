import React, { useState } from 'react';
import { Search,Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import custom SVG icons for more professional look
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
    // Close profile menu if open
    if (profileMenuOpen) setProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(prev => !prev);
    // Close mobile menu if open
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Close menus after navigation
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  // Check if current path matches the nav item path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full h-20 px-4 md:px-8 lg:px-16 xl:px-24 bg-white shadow-sm flex justify-between items-center fixed top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 relative overflow-hidden rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
          <div className="w-6 h-6 absolute bg-white rotate-45 transform translate-x-3"></div>
        </div>
        <div className="text-gray-800 text-xl font-bold">
          Skill<span className="text-blue-600">Bridge</span>
        </div>
      </div>
      
      {/* Search Bar - LinkedIn style */}
      {/* <div className="hidden md:block max-w-md w-full mx-4">
        <div className={`relative w-full ${searchFocused ? 'ring-2 ring-blue-500' : ''}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            className="bg-gray-100 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div> */}
      
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button 
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-2">
        <NavItem 
          icon={<HomeIcon />} 
          text="Home" 
          active={isActive('/')} 
          onClick={() => handleNavigation('/')} 
        />
        <NavItem 
          icon={<UserPlusIcon />} 
          text="Mentor" 
          active={isActive('/mentor')} 
          onClick={() => handleNavigation('/mentor')} 
        />
        <NavItem 
          icon={<MessageIcon />} 
          text="Messaging" 
          active={isActive('/messages')} 
          onClick={() => handleNavigation('/messages')} 
        />
        <NavItem 
          icon={<NotificationIcon />} 
          text="Notifications" 
          active={isActive('/notifications')} 
          onClick={() => handleNavigation('/notifications')} 
        />
        
        {/* Profile Menu */}
        <div className="relative ml-4">
          <div className="flex flex-col items-center cursor-pointer" onClick={toggleProfileMenu}>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow-sm border border-gray-300">
              {/* Profile image - replace URL with your actual profile image */}
              <img 
                src="/api/placeholder/80/80" 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = ""; // Fallback to icon if image fails
                  e.target.parentNode.innerHTML = '<User size={18} strokeWidth={2} className="text-gray-600" />';
                }}
              />
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-gray-700">ME</span>
              <ChevronDown size={12} className="text-gray-600 ml-1" />
            </div>
          </div>
          
          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="font-medium text-gray-800">John Doe</div>
                <div className="text-sm text-gray-500">john.doe@example.com</div>
              </div>
              <ProfileMenuItem 
                icon={<ProfileIcon />} 
                text="View Profile" 
                onClick={() => handleNavigation('/profile')} 
              />
              <ProfileMenuItem 
                icon={<SettingsIcon />} 
                text="Settings" 
                onClick={() => handleNavigation('/settings')} 
              />
              <ProfileMenuItem 
                icon={<HelpIcon />} 
                text="Help" 
                onClick={() => handleNavigation('/help')} 
              />
              <div className="border-t border-gray-100 my-1"></div>
              <ProfileMenuItem 
                icon={<LogoutIcon />} 
                text="Logout" 
                onClick={() => handleNavigation('/logout')} 
              />
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50 md:hidden">
          <div className="p-3">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                className="bg-gray-100 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="flex flex-col py-2">
            <MobileNavItem 
              icon={<HomeIcon />} 
              text="Home" 
              active={isActive('/')} 
              onClick={() => handleNavigation('/')} 
            />
            <MobileNavItem 
              icon={<UserPlusIcon />} 
              text="Mentor" 
              active={isActive('/mentor')} 
              onClick={() => handleNavigation('/mentor')} 
            />
            <MobileNavItem 
              icon={<MessageIcon />} 
              text="Messaging" 
              active={isActive('/messages')} 
              onClick={() => handleNavigation('/messages')} 
            />
            <MobileNavItem 
              icon={<NotificationIcon />} 
              text="Notifications" 
              active={isActive('/notifications')} 
              onClick={() => handleNavigation('/notifications')} 
            />
            <div className="border-t border-gray-100 my-2"></div>
            <MobileNavItem 
              icon={<ProfileIcon />} 
              text="View Profile" 
              active={isActive('/profile')} 
              onClick={() => handleNavigation('/profile')} 
            />
            <MobileNavItem 
              icon={<SettingsIcon />} 
              text="Settings" 
              active={isActive('/settings')} 
              onClick={() => handleNavigation('/settings')} 
            />
            <MobileNavItem 
              icon={<HelpIcon />} 
              text="Help" 
              active={isActive('/help')} 
              onClick={() => handleNavigation('/help')} 
            />
            <MobileNavItem 
              icon={<LogoutIcon />} 
              text="Logout" 
              active={false} 
              onClick={() => handleNavigation('/logout')} 
            />
          </div>
        </div>
      )}
    </header>
  );
};

const NavItem = ({ icon, text, active, onClick }) => {
  return (
    <div 
      className={`flex flex-col items-center px-3 py-2 border-b-2 ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'} transition-all duration-200 cursor-pointer`}
      onClick={onClick}
    >
      <div className={`${active ? 'text-blue-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-xs mt-1 font-medium ${active ? 'text-blue-600' : 'text-gray-600'}`}>{text}</span>
    </div>
  );
};

const MobileNavItem = ({ icon, text, active, onClick }) => {
  return (
    <div 
      className={`flex items-center gap-3 px-6 py-3 ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'} cursor-pointer`}
      onClick={onClick}
    >
      <div className={`${active ? 'text-blue-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-base font-medium ${active ? 'text-blue-600' : 'text-gray-600'}`}>{text}</span>
    </div>
  );
};

const ProfileMenuItem = ({ icon, text, onClick }) => {
  return (
    <div 
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <span className="mr-2 text-gray-500">{icon}</span>
      {text}
    </div>
  );
};

export default Header;