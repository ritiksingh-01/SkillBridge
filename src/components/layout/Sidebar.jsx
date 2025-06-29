import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  MessageSquare, 
  Bell, 
  Users, 
  Search,
  Settings, 
  HelpCircle,
  UserPlus
} from 'lucide-react';

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const mentorNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/mentor-dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: UserPlus, label: 'Find Mentees', path: '/find-mentees' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' }
  ];

  const menteeNavItems = [
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Search, label: 'Find Mentors', path: '/find-mentors' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' }
  ];

  const navItems = userRole === 'mentor' ? mentorNavItems : menteeNavItems;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 z-30">
      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;