import React, { useState } from 'react';
import { Home, UserPlus, User, Bell, Menu, MessageCircle, X, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };


  const navigate = useNavigate();
  function handleHome(){
    navigate('/');
  }

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
      <nav className="hidden md:flex items-center space-x-6">
        <NavItem icon={<Home size={20} strokeWidth={2} />} text="Home" active={false} onClick = {handleHome} />
        <NavItem icon={<UserPlus size={20} strokeWidth={2} />} text="Mentor" active={true} />
        <NavItem icon={<Bell size={20} strokeWidth={2} />} text="Notifications" active={false} />
        <NavItem icon={<MessageCircle size={20} strokeWidth={2} />} text="Messages" active={false} />
        
        <div className="ml-4 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shadow-md cursor-pointer">
          <User size={18} strokeWidth={2} className="text-white" />
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50 md:hidden">
          <div className="flex flex-col py-2">
            <MobileNavItem icon={<Home size={20} strokeWidth={2} />} text="Home" active={false} />
            <MobileNavItem icon={<UserPlus size={20} strokeWidth={2} />} text="Mentor" active={true} />
            <MobileNavItem icon={<Bell size={20} strokeWidth={2} />} text="Notifications" active={false} />
            <MobileNavItem icon={<MessageCircle size={20} strokeWidth={2} />} text="Messages" active={false} />
            <div className="border-t border-gray-100 my-2"></div>
            <MobileNavItem icon={<Settings size={20} strokeWidth={2} />} text="Settings" active={false} />
            <MobileNavItem icon={<HelpCircle size={20} strokeWidth={2} />} text="Help" active={false} />
            <MobileNavItem icon={<LogOut size={20} strokeWidth={2} />} text="Logout" active={false} />
          </div>
        </div>
      )}
    </header>
  );
};

const NavItem = ({ icon, text, active }) => {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'} transition-all duration-200`}>
      <div className={`${active ? 'text-blue-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-blue-600' : 'text-gray-600'}`}>{text}</span>
    </div>
  );
};

const MobileNavItem = ({ icon, text, active }) => {
  return (
    <div className={`flex items-center gap-3 px-6 py-3 ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
      <div className={`${active ? 'text-blue-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-base font-medium ${active ? 'text-blue-600' : 'text-gray-600'}`}>{text}</span>
    </div>
  );
};

export default Header;