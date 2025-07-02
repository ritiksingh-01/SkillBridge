import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  BookOpen, 
  Star, 
  TrendingUp, 
  MessageSquare,
  Clock,
  Award,
  Search,
  Filter,
  ChevronRight,
  Video,
  Phone,
  CheckCircle,
  Users,
  Target,
  Zap,
  ArrowRight,
  Plus
} from 'lucide-react';
import Header from '../../Components/Header';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MenteeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalMentors: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for development
  const mockSessions = [
    {
      _id: '1',
      title: 'React Development Session',
      mentor: {
        user: {
          firstName: 'John',
          lastName: 'Doe',
          profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
        }
      },
      scheduledAt: new Date().toISOString(),
      duration: 60,
      meetingType: 'video',
      price: 150,
      status: 'confirmed'
    },
    {
      _id: '2',
      title: 'Career Guidance',
      mentor: {
        user: {
          firstName: 'Jane',
          lastName: 'Smith',
          profileImage: 'https://randomuser.me/api/portraits/women/1.jpg'
        }
      },
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      duration: 45,
      meetingType: 'video',
      price: 120,
      status: 'pending'
    }
  ];

  const mockMentors = [
    {
      _id: '1',
      user: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      currentRole: 'Senior Software Engineer',
      expertise: ['React', 'Node.js', 'JavaScript'],
      rating: { average: 4.8, count: 25 },
      pricing: { oneOnOneSession: 180 }
    },
    {
      _id: '2',
      user: {
        firstName: 'Mike',
        lastName: 'Chen',
        profileImage: 'https://randomuser.me/api/portraits/men/2.jpg'
      },
      currentRole: 'Product Manager',
      expertise: ['Product Strategy', 'UX Design', 'Analytics'],
      rating: { average: 4.9, count: 32 },
      pricing: { oneOnOneSession: 200 }
    }
  ];

  const mockNotifications = [
    {
      _id: '1',
      title: 'Session Reminder',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'New Message',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use mock data since API might not be ready
      // TODO: Replace with actual API calls when backend is ready
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSessions(mockSessions);
      setRecommendedMentors(mockMentors);
      setNotifications(mockNotifications);

      // Calculate stats from mock data
      const totalSessions = mockSessions.length;
      const completedSessions = mockSessions.filter(s => s.status === 'completed').length;
      const upcomingSessions = mockSessions.filter(s => s.status === 'confirmed').length;
      
      setStats({
        totalSessions,
        completedSessions,
        upcomingSessions,
        totalMentors: mockMentors.length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      
      // Set default values to prevent crashes
      setSessions([]);
      setRecommendedMentors([]);
      setNotifications([]);
      setStats({
        totalSessions: 0,
        completedSessions: 0,
        upcomingSessions: 0,
        totalMentors: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description, onClick }) => (
    <div 
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {onClick && <ChevronRight className="w-5 h-5 text-gray-400" />}
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

    const mentorName = session.mentor?.user ? 
      `${session.mentor.user.firstName} ${session.mentor.user.lastName}` : 
      'Unknown Mentor';
    
    const mentorImage = session.mentor?.user?.profileImage || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}`;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img 
              src={mentorImage}
              alt={mentorName}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}`;
              }}
            />
            <div>
              <h4 className="font-medium text-gray-900">{mentorName}</h4>
              <p className="text-sm text-gray-600">{session.title || 'Mentorship Session'}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
            <span className="capitalize">{session.status || 'pending'}</span>
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
              <span>{session.duration || 60} min</span>
            </div>
            <div className="flex items-center space-x-1">
              {session.meetingType === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              <span className="capitalize">{session.meetingType || 'video'}</span>
            </div>
          </div>
          <span className="font-medium text-green-600">₹{session.price || 0}</span>
        </div>

        {session.status === 'confirmed' && (
          <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Join Session
          </button>
        )}
      </div>
    );
  };

  const MentorCard = ({ mentor }) => {
    const mentorName = mentor.user ? 
      `${mentor.user.firstName} ${mentor.user.lastName}` : 
      'Unknown Mentor';
    
    const mentorImage = mentor.user?.profileImage || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}`;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 mb-3">
          <img 
            src={mentorImage}
            alt={mentorName}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}`;
            }}
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{mentorName}</h4>
            <p className="text-sm text-gray-600">{mentor.currentRole || 'Mentor'}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                {mentor.rating?.average?.toFixed(1) || '5.0'}
              </span>
              <span className="text-xs text-gray-500">({mentor.rating?.count || 0})</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {(mentor.expertise || ['Mentoring']).slice(0, 3).map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {skill}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-green-600">
            ₹{mentor.pricing?.oneOnOneSession || 150}/hr
          </span>
          <button 
            onClick={() => navigate(`/mentorProfile`, { state: { mentorData: mentor } })}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Profile
          </button>
        </div>
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
            Welcome back, {user?.firstName || 'Student'}! 🚀
          </h1>
          <p className="text-gray-600">Continue your learning journey and connect with amazing mentors.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sessions"
            value={stats.totalSessions}
            icon={Calendar}
            color="bg-blue-600"
            description="All time"
            onClick={() => navigate('/sessions')}
          />
          <StatCard
            title="Completed Sessions"
            value={stats.completedSessions}
            icon={CheckCircle}
            color="bg-green-600"
            description="Successfully finished"
          />
          <StatCard
            title="Upcoming Sessions"
            value={stats.upcomingSessions}
            icon={Clock}
            color="bg-orange-600"
            description="Scheduled"
          />
          <StatCard
            title="Find Mentors"
            value={`${stats.totalMentors}+`}
            icon={Users}
            color="bg-purple-600"
            description="Available mentors"
            onClick={() => navigate('/findMentorPage')}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Sessions</h2>
                  <button 
                    onClick={() => navigate('/findMentorPage')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book Session</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {sessions && sessions.length > 0 ? (
                    sessions.slice(0, 5).map((session) => (
                      <SessionCard key={session._id} session={session} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                      <p className="text-gray-600 mb-4">Start your mentorship journey by booking your first session.</p>
                      <button 
                        onClick={() => navigate('/findMentorPage')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Find a Mentor
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommended Mentors */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recommended Mentors</h2>
                  <button 
                    onClick={() => navigate('/findMentorPage')}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedMentors && recommendedMentors.length > 0 ? (
                    recommendedMentors.slice(0, 4).map((mentor) => (
                      <MentorCard key={mentor._id} mentor={mentor} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
                      <p className="text-gray-600">Check back later for mentor recommendations.</p>
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
                  onClick={() => navigate('/findMentorPage')}
                  className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Search className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Find Mentors</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                </button>
                <button 
                  onClick={() => navigate('/message')}
                  className="w-full flex items-center justify-between p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Messages</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-green-600" />
                </button>
                <button 
                  onClick={() => navigate('/menteeProfile')}
                  className="w-full flex items-center justify-between p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">My Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-600" />
                </button>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Goals</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Target className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">Complete React Course</p>
                    <div className="w-full bg-yellow-200 rounded-full h-2 mt-1">
                      <div className="bg-yellow-600 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Master JavaScript</p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                      <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
                + Add New Goal
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
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
                  <p className="text-sm text-gray-600">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard;