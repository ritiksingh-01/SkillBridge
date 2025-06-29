import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  TrendingUp, 
  MessageSquare,
  Clock,
  Award,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  ChevronRight,
  Video,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Header from '../../Components/Header';
import { useAuth } from '../../context/AuthContext';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now since API endpoints might not be working
      const mockStats = {
        totalSessions: 24,
        totalMentees: 12,
        rating: { average: 4.8, count: 18 },
        earnings: 15600,
        responseTime: '~2 hours',
        completionRate: 95
      };

      const mockSessions = [
        {
          _id: '1',
          title: 'React Development Guidance',
          mentee: {
            firstName: 'John',
            lastName: 'Doe',
            profileImage: 'https://ui-avatars.com/api/?name=John+Doe'
          },
          scheduledAt: new Date().toISOString(),
          duration: 60,
          price: 500,
          status: 'pending',
          meetingType: 'video'
        },
        {
          _id: '2',
          title: 'Career Transition Advice',
          mentee: {
            firstName: 'Jane',
            lastName: 'Smith',
            profileImage: 'https://ui-avatars.com/api/?name=Jane+Smith'
          },
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          duration: 45,
          price: 400,
          status: 'confirmed',
          meetingType: 'video'
        }
      ];

      const mockNotifications = [
        {
          _id: '1',
          title: 'New session request',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Payment received',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStats(mockStats);
      setSessions(mockSessions);
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionAction = async (sessionId, action) => {
    try {
      // Update session status locally for now
      setSessions(prev => 
        prev.map(session => 
          session._id === sessionId 
            ? { ...session, status: action }
            : session
        )
      );
    } catch (error) {
      console.error('Error updating session:', error);
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
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
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

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img 
              src={session.mentee?.profileImage || `https://ui-avatars.com/api/?name=${session.mentee?.firstName}+${session.mentee?.lastName}`}
              alt={`${session.mentee?.firstName} ${session.mentee?.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 className="font-medium text-gray-900">
                {session.mentee?.firstName} {session.mentee?.lastName}
              </h4>
              <p className="text-sm text-gray-600">{session.title}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(session.status)}`}>
            {getStatusIcon(session.status)}
            <span className="capitalize">{session.status}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{session.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              {session.meetingType === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              <span className="capitalize">{session.meetingType}</span>
            </div>
          </div>
          <span className="font-medium text-green-600">₹{session.price}</span>
        </div>

        {session.status === 'pending' && (
          <div className="flex space-x-2">
            <button 
              onClick={() => handleSessionAction(session._id, 'confirmed')}
              className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Accept
            </button>
            <button 
              onClick={() => handleSessionAction(session._id, 'cancelled')}
              className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Decline
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            <div className="text-red-600 mb-4">
              <AlertCircle className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
            value={stats?.totalSessions || 0}
            icon={Calendar}
            color="bg-blue-600"
            change={12}
            description="This month"
          />
          <StatCard
            title="Active Mentees"
            value={stats?.totalMentees || 0}
            icon={Users}
            color="bg-green-600"
            change={8}
            description="Currently mentoring"
          />
          <StatCard
            title="Average Rating"
            value={`${stats?.rating?.average?.toFixed(1) || '0.0'}/5`}
            icon={Star}
            color="bg-yellow-600"
            description={`${stats?.rating?.count || 0} reviews`}
          />
          <StatCard
            title="Response Time"
            value={stats?.responseTime || '~2 hours'}
            icon={Clock}
            color="bg-purple-600"
            description="Average response"
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
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {sessions && sessions.length > 0 ? (
                    sessions.map((session) => (
                      <SessionCard key={session._id} session={session} />
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
                <button className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Set Availability</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Update Pricing</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-green-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
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
                    <div key={notification._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
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
                  <span className="text-sm font-medium text-gray-900">{stats?.completionRate || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${stats?.completionRate || 0}%` }}
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