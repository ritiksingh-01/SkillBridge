import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChalkboardTeacher, faEnvelope, faBell, faUser , faCog, faQuestionCircle, faSignOutAlt, faBars, faTimes, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ userProfilePic }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
    if (profileMenuOpen) setProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(prev => !prev);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Profile picture URL fallback logic
  const profilePicUrl = !profileImageError && userProfilePic ? userProfilePic : 'https://images.unsplash.com/photo-1517841905240-472988babdf9';

  return (
    <header className="w-full h-20 px-4 md:px-8 lg:px-16 xl:px-24 bg-white shadow-sm flex justify-between items-center fixed top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 relative overflow-hidden rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
          <div className="w-6 h-6 absolute bg-white rotate-45 transform translate-x-3"></div>
        </div>
        <div className="text-gray-800 text-xl font-bold">Skill<span className="text-blue-600">Bridge</span></div>
      </div>

      <div className="md:hidden">
        <button 
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FontAwesomeIcon icon={faTimes} size="lg" /> : <FontAwesomeIcon icon={faBars} size="lg" />}
        </button>
      </div>

      <nav className="hidden md:flex items-center space-x-2">
        <NavItem 
          icon={<FontAwesomeIcon icon={faHome} />} 
          text="Home" 
          active={isActive('/')} 
          onClick={() => handleNavigation('/')} 
        />
        <NavItem 
          icon={<FontAwesomeIcon icon={faChalkboardTeacher} />} 
          text="Mentor" 
          active={isActive('/findMentorPage')} 
          onClick={() => handleNavigation('/findMentorPage')} 
        />
        <NavItem 
          icon={<FontAwesomeIcon icon={faEnvelope} />} 
          text="Messaging" 
          active={isActive('/message')} 
          onClick={() => handleNavigation('/message')} 
        />
        <NavItem 
          icon={<FontAwesomeIcon icon={faBell} />} 
          text="Notifications" 
          active={isActive('/notifications')} 
          onClick={() => handleNavigation('/notifications')} 
        />
        <div className="relative ml-2">
          <div 
            className="flex flex-col items-center cursor-pointer w-12" 
            onClick={toggleProfileMenu}
            aria-label="User  profile menu"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow-sm border border-gray-300">
              {profilePicUrl && !profileImageError ? (
                <img 
                  src={profilePicUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={() => setProfileImageError(true)}
                />
              ) : (
                <FontAwesomeIcon icon={faUser } className="text-gray-500" />
              )}
            </div>
            <div className="flex items-center mt-1 select-none">
              <span className="text-xs font-medium text-gray-500">ME</span>
              <FontAwesomeIcon icon={faChevronDown} className="text-gray-500 ml-1" />
            </div>
          </div>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="font-medium text-gray-800">John Doe</div>
                <div className="text-sm text-gray-500">john.doe@example.com</div>
              </div>
              <ProfileMenuItem 
                icon={<FontAwesomeIcon icon={faUser } />} 
                text="View Profile" 
                onClick={() => handleNavigation('/profile')} 
              />
              <ProfileMenuItem 
                icon={<FontAwesomeIcon icon={faCog} />} 
                text="Settings" 
                onClick={() => handleNavigation('/settings')} 
              />
              <ProfileMenuItem 
                icon={<FontAwesomeIcon icon={faQuestionCircle} />} 
                text="Help" 
                onClick={() => handleNavigation('/help')} 
              />
              <div className="border-t border-gray-100 my-1"></div>
              <ProfileMenuItem 
                icon={<FontAwesomeIcon icon={faSignOutAlt} />} 
                text="Logout" 
                onClick={() => handleNavigation('/logout')} 
              />
            </div>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50 md:hidden">
          <div className="p-3">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} size="lg" className="text-gray-500" />
              </div>
              <input
                type="text"
                className="bg-gray-100 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
          <div className="flex flex-col py-2">
            <MobileNavItem 
              icon={<FontAwesomeIcon icon={faHome} />} 
              text="Home" 
              active={isActive('/')} 
              onClick={() => handleNavigation('/')} 
            />
            <MobileNavItem 
              icon={<FontAwesomeIcon icon={faChalkboardTeacher} />} 
              text="Mentor" 
              active={isActive('/findMentorPage')} 
              onClick={() => handleNavigation('/findMentorPage')} 
            />
            <MobileNavItem 
              icon={<FontAwesomeIcon icon={faEnvelope} />} 
              text="Messaging" 
              active={isActive('/messages')} 
              onClick={() => handleNavigation('/messages')} 
            />
            <MobileNavItem 
              icon={<FontAwesomeIcon icon={faBell} />} 
              text="Notifications" 
              active={isActive('/notifications')} 
              onClick={() => handleNavigation('/notifications')} 
            />
            <div className="border-t border-gray-100 my-2"></div>
            <MobileNavItem 
              icon={<FontAwesomeIcon icon={faUser } />} 
              text="View Profile" 
              active={isActive('/profile')} 
              onClick={() => handleNavigation('/profile')} 
            />
            <MobileNavItem 
              icon={<FontAwesomeIcon icon={faCog} />} 
              text="Settings" 
              active={isActive('/settings')} 
              onClick={() => handleNavigation('/settings')} 
            />
            <MobileNavItem 
              icon={<FontAwesomeIcon icon={faQuestionCircle} />} 
              text="Help" 
              active={isActive('/help')} 
              onClick={() => handleNavigation('/help')} 
            />
            <MobileNavItem 
              icon={<FontAwesomeIcon icon={faSignOutAlt} />} 
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
    <div className={`flex flex-col items-center px-3 py-2 border-b-2 ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'} transition-all duration-200 cursor-pointer`} onClick={onClick}>
      <div className={`${active ? 'text-blue-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-xs mt-1 font-medium ${active ? 'text-blue-600' : 'text-gray-600'}`}>
        {text}
      </span>
    </div>
  );
};
const MobileNavItem = ({ icon, text, active, onClick }) => {
  return (
    <div className={`flex items-center gap-3 px-6 py-3 ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'} cursor-pointer`} onClick={onClick}>
      <div className={`${active ? 'text-blue-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-base font-medium ${active ? 'text-blue-600' : 'text-gray-600'}`}>
        {text}
      </span>
    </div>
  );
};

const ProfileMenuItem = ({ icon, text, onClick }) => {
  return (
    <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={onClick}>
      <span className="mr-2 text-gray-500">{icon}</span>
      {text}
    </div>
  );
};

export default Header;