import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Users, 
  Star, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  Video,
  Phone,
  CheckCircle,
  Bell,
  Settings,
  DollarSign,
  Filter,
  Search,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Header from '../../Components/Header';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { sessionsAPI, mentorsAPI, notificationsAPI } from '../../services/api';

const MentorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMentees: 0,
    rating: { average: 0, count: 0 },
    earnings: 0,
    responseTime: '~2 hours',
    completionRate: 100
  });
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const extractArray = (res, key) => {
    if (!res) return [];
    const body = res.data ?? res;
    if (Array.isArray(body)) return body;
    if (body && Array.isArray(body[key])) return body[key];
    if (body && Array.isArray(body.data)) return body.data;
    return [];
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, sessionsRes, notifsRes] = await Promise.allSettled([
        mentorsAPI.getDashboardStats(),
        sessionsAPI.getAll({ limit: 10 }),
        notificationsAPI.getAll({ limit: 6 })
      ]);

      const sessionList = sessionsRes.status === 'fulfilled'
        ? extractArray(sessionsRes.value, 'sessions')
        : [];

      const notifList = notifsRes.status === 'fulfilled'
        ? extractArray(notifsRes.value, 'notifications')
        : [];

      setSessions(sessionList);
      setNotifications(notifList);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        const d = statsRes.value.data;
        const total = d.totalSessions !== undefined ? d.totalSessions : sessionList.length;
        const uniqueMentees = d.totalMentees !== undefined 
          ? d.totalMentees 
          : new Set(sessionList.map(s => s && (s.mentee?._id || s.mentee?.id)).filter(Boolean)).size;

        setStats({
          totalSessions: total,
          totalMentees: uniqueMentees,
          rating: {
            average: d.rating?.average || 5.0,
            count: d.rating?.count || 0
          },
          earnings: d.earnings !== undefined 
            ? d.earnings 
            : sessionList.reduce((acc, s) => s && s.status === 'completed' ? acc + (s.price || 0) : acc, 0),
          responseTime: d.responseTime || '~2 hours',
          completionRate: d.completionRate !== undefined ? d.completionRate : 100
        });
      } else {
        const completed = sessionList.filter(s => s && s.status === 'completed').length;
        const total = sessionList.length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;
        const earnings = sessionList
          .filter(s => s && s.status === 'completed')
          .reduce((sum, s) => sum + (s.price || 0), 0);
        const uniqueMentees = new Set(sessionList.map(s => s && (s.mentee?._id || s.mentee?.id)).filter(Boolean)).size;

        setStats({
          totalSessions: total,
          totalMentees: uniqueMentees,
          rating: { average: 5.0, count: 0 },
          earnings,
          responseTime: '~2 hours',
          completionRate
        });
      }
    } catch (err) {
      console.error('Error fetching mentor dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSessionAction = async (sessionId, action) => {
    try {
      await sessionsAPI.updateStatus(sessionId, { status: action });
      setSessions(prev => 
        prev.map(session => 
          (session._id === sessionId || session.id === sessionId)
            ? { ...session, status: action }
            : session
        )
      );
    } catch (err) {
      console.error('Error updating session status:', err);
      alert(err.response?.data?.message || 'Failed to update session status.');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change, description }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value || 0}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );

  const SessionCard = ({ session }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'confirmed': return <CheckCircle className="w-4 h-4" />;
        case 'pending': return <AlertCircle className="w-4 h-4" />;
        case 'completed': return <CheckCircle className="w-4 h-4" />;
        case 'cancelled': return <XCircle className="w-4 h-4" />;
        default: return <Clock className="w-4 h-4" />;
      }
    };

    const menteeName = session.mentee ? 
      `${session.mentee.firstName} ${session.mentee.lastName}` : 
      'Unknown Mentee';
    
    const menteeImage = session.mentee?.profileImage || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(menteeName)}`;

    const sessionId = session._id || session.id;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img 
              src={menteeImage}
              alt={menteeName}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(menteeName)}`;
              }}
            />
            <div>
              <h4 className="font-medium text-gray-900">{menteeName}</h4>
              <p className="text-sm text-gray-600">{session.title || 'Mentorship Session'}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(session.status)}`}>
            {getStatusIcon(session.status)}
            <span className="capitalize">{session.status || 'pending'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{session.scheduledAt ? new Date(session.scheduledAt).toLocaleDateString() : 'TBD'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{session.duration || 60} min</span>
            </div>
            <div className="flex items-center space-x-1">
              {session.meetingType === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              <span className="capitalize">{session.meetingType || 'video'}</span>
            </div>
          </div>
          <span className="font-medium text-green-600">₹{session.price || 0}</span>
        </div>

        {session.status === 'pending' && (
          <div className="flex space-x-2">
            <button 
              onClick={() => handleSessionAction(sessionId, 'confirmed')}
              className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Accept
            </button>
            <button 
              onClick={() => handleSessionAction(sessionId, 'cancelled')}
              className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Decline
            </button>
          </div>
        )}

        {session.status === 'confirmed' && (
          <div className="flex space-x-2">
            <button 
              onClick={() => navigate('/message')}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Chat with Mentee
            </button>
            <button 
              onClick={() => handleSessionAction(sessionId, 'completed')}
              className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Mark Completed
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96 mt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96 mt-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Mentor'}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your mentorship activities today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sessions"
            value={stats.totalSessions}
            icon={Calendar}
            color="bg-blue-600"
            change={12}
            description="All sessions"
          />
          <StatCard
            title="Active Mentees"
            value={stats.totalMentees}
            icon={Users}
            color="bg-green-600"
            change={8}
            description="Currently mentoring"
          />
          <StatCard
            title="Average Rating"
            value={`${(stats.rating?.average || 5.0).toFixed(1)}/5`}
            icon={Star}
            color="bg-yellow-600"
            description={`${stats.rating?.count || 0} reviews`}
          />
          <StatCard
            title="Total Earnings"
            value={`₹${stats.earnings || 0}`}
            icon={Clock}
            color="bg-purple-600"
            description="Completed sessions"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Sessions</h2>
                  <div className="flex items-center space-x-2">
                    <button 
                      aria-label="Filter" 
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                    <button 
                      aria-label="Search" 
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {sessions && sessions.length > 0 ? (
                    sessions.map((session) => (
                      <SessionCard key={session._id || session.id} session={session} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                      <p className="text-gray-600">Your upcoming sessions will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Set Availability</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                </button>
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center justify-between p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Update Pricing</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-green-600" />
                </button>
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center justify-between p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Profile Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-600" />
                </button>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {notifications && notifications.length > 0 ? (
                  notifications.slice(0, 3).map((notification) => (
                    <div key={notification._id || notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No new notifications</p>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium text-gray-900">{stats.completionRate || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${stats.completionRate || 0}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-medium text-gray-900">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-[95%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
