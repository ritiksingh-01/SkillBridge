import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  X, 
  User, 
  Calendar, 
  BookOpen, 
  Award, 
  MessageCircle, 
  Users, 
  ChevronDown, 
  Search, 
  Settings,
  Archive,
  Star,
  Clock,
  AlertCircle,
  Trash2,
  CheckCheck,
  Filter
} from 'lucide-react';
import Header from '../Components/Header';

const NotificationPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'compact'
  const [showActions, setShowActions] = useState(false);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'mentorship_request',
      title: 'New Mentorship Request',
      message: 'Sarah Johnson has requested you as a mentor for Frontend Development. She has 2 years of experience and is looking to advance her React skills.',
      time: '2 minutes ago',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isRead: false,
      avatar: 'SJ',
      priority: 'high',
      category: 'Mentorship',
      actionRequired: true
    },
    {
      id: 2,
      type: 'session_reminder',
      title: 'Upcoming Session Reminder',
      message: 'Your mentoring session with Alex Chen is scheduled in 30 minutes. Topic: Advanced React Patterns',
      time: '28 minutes ago',
      timestamp: new Date(Date.now() - 28 * 60 * 1000),
      isRead: false,
      avatar: 'AC',
      priority: 'high',
      category: 'Sessions',
      actionRequired: true
    },
    {
      id: 3,
      type: 'skill_achievement',
      title: 'Skill Badge Earned',
      message: 'Congratulations! You\'ve earned the "React Expert" badge after completing 10 successful mentoring sessions.',
      time: '1 hour ago',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: true,
      avatar: '',
      priority: 'medium',
      category: 'Achievements',
      actionRequired: false
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      message: 'Michael Brown sent you a message about the Python project: "Thanks for the great session yesterday! Could we schedule a follow-up?"',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      avatar: 'MB',
      priority: 'medium',
      category: 'Messages',
      actionRequired: false
    },
    {
      id: 5,
      type: 'group_activity',
      title: 'Group Discussion',
      message: 'New activity in "Web Development Fundamentals" group - 5 new comments on "Best Practices for API Design"',
      time: '3 hours ago',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: true,
      avatar: '',
      priority: 'low',
      category: 'Groups',
      actionRequired: false
    },
    {
      id: 6,
      type: 'session_completed',
      title: 'Session Completed',
      message: 'Your mentoring session with Emma Davis has been completed. Please rate your experience and provide feedback.',
      time: '1 day ago',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      avatar: 'ED',
      priority: 'low',
      category: 'Sessions',
      actionRequired: true
    },
    {
      id: 7,
      type: 'system',
      title: 'Profile Update Reminder',
      message: 'Your profile hasn\'t been updated in 30 days. Adding recent skills and achievements can help attract more mentees.',
      time: '2 days ago',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isRead: false,
      avatar: '',
      priority: 'low',
      category: 'System',
      actionRequired: false
    }
  ]);

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'mentorship_request':
        return <User className={iconClass} />;
      case 'session_reminder':
        return <Calendar className={iconClass} />;
      case 'skill_achievement':
        return <Award className={iconClass} />;
      case 'message':
        return <MessageCircle className={iconClass} />;
      case 'group_activity':
        return <Users className={iconClass} />;
      case 'session_completed':
        return <BookOpen className={iconClass} />;
      case 'system':
        return <Settings className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationColor = (type, priority, isRead) => {
    const baseOpacity = isRead ? 'opacity-70' : 'opacity-100';
    
    if (priority === 'high') {
      return `bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-700 ${baseOpacity}`;
    }
    if (priority === 'medium') {
      return `bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-700 ${baseOpacity}`;
    }
    return `bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-600 ${baseOpacity}`;
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Urgent
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Important
          </span>
        );
      default:
        return null;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const toggleNotificationSelection = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: false } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    setSelectedNotifications(prev => prev.filter(notifId => notifId !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const bulkMarkAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => 
        selectedNotifications.includes(notif.id) 
          ? { ...notif, isRead: true } 
          : notif
      )
    );
    setSelectedNotifications([]);
  };

  const bulkDelete = () => {
    setNotifications(prev => 
      prev.filter(notif => !selectedNotifications.includes(notif.id))
    );
    setSelectedNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'unread' && !notif.isRead) ||
      (activeFilter === 'read' && notif.isRead) ||
      (activeFilter === 'urgent' && notif.priority === 'high') ||
      (activeFilter === 'action_required' && notif.actionRequired) ||
      notif.type === activeFilter;
    
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length, icon: Bell },
    { value: 'unread', label: 'Unread', count: unreadCount, icon: AlertCircle },
    { value: 'urgent', label: 'Urgent', count: urgentCount, icon: AlertCircle },
    { value: 'action_required', label: 'Action Required', count: actionRequiredCount, icon: CheckCheck },
    { value: 'mentorship_request', label: 'Mentorship', count: notifications.filter(n => n.type === 'mentorship_request').length, icon: User },
    { value: 'session_reminder', label: 'Sessions', count: notifications.filter(n => n.type === 'session_reminder').length, icon: Calendar },
    { value: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length, icon: MessageCircle },
  ];

  // Auto-refresh timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => 
        prev.map(notif => ({
          ...notif,
          time: formatTimeAgo(notif.timestamp)
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header/>
      
      {/* Controls Section - Fixed positioning with proper spacing */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-gray-200/50 sticky top-20 z-40 shadow-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search and Action Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {selectedNotifications.length > 0 && (
                <div className="flex items-center space-x-2 mr-4">
                  <span className="text-sm text-gray-600">
                    {selectedNotifications.length} selected
                  </span>
                  <button
                    onClick={bulkMarkAsRead}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center space-x-1 text-sm"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark Read</span>
                  </button>
                  <button
                    onClick={bulkDelete}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center space-x-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
              
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>

              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'compact' : 'list')}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>{viewMode === 'list' ? 'Compact' : 'Detailed'}</span>
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => {
              const IconComponent = option.icon;
              const isActive = activeFilter === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setActiveFilter(option.value)}
                  className={`px-3 py-2 rounded-lg border transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{option.label}</span>
                  {option.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifications List - Added proper top margin to prevent overlap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.' 
                : 'You\'re all caught up! New notifications will appear here when they arrive.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative bg-white rounded-lg border transition-all duration-200 hover:shadow-md group ${
                  notification.isRead 
                    ? 'border-gray-200' 
                    : 'border-blue-200 shadow-sm'
                } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
              >
                <div className={`p-4 ${viewMode === 'compact' ? 'py-3' : ''}`}>
                  <div className="flex items-start space-x-4">
                    {/* Selection Checkbox */}
                    <div className="flex items-center pt-1">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleNotificationSelection(notification.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      />
                    </div>

                    {/* Notification Icon */}
                    <div className={`p-2.5 rounded-lg flex-shrink-0 ${getNotificationColor(notification.type, notification.priority, notification.isRead)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            {getPriorityBadge(notification.priority)}
                            {notification.actionRequired && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                <CheckCheck className="w-3 h-3 mr-1" />
                                Action Required
                              </span>
                            )}
                          </div>
                          
                          {viewMode === 'list' && (
                            <p className={`text-sm mb-2 ${notification.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-xs text-gray-500 font-medium">{notification.time}</span>
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {notification.category}
                              </span>
                              {notification.avatar && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                    {notification.avatar}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-4">
                          {notification.isRead ? (
                            <button
                              onClick={() => markAsUnread(notification.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Mark as unread"
                            >
                              <Bell className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Priority Indicators */}
                {notification.priority === 'high' && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-red-500 rounded-l-lg"></div>
                )}
                {notification.priority === 'medium' && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-amber-500 rounded-l-lg"></div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More Section */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Load More Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;