import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  Users, 
  MessageCircle, 
  Video,
  Phone,
  ChevronLeft,
  Heart,
  Share2,
  CheckCircle,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Target,
  Briefcase,
  Building,
  ExternalLink
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const MentorProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSessionType, setSelectedSessionType] = useState('query');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Get mentor data from navigation state or use default
  const mentorData = location.state?.mentorData || {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Product Manager",
    experience: "Former Amazon, Google",
    rating: 4.9,
    reviews: 24,
    skills: ["Product Strategy", "Leadership", "UX Design", "Data Analysis", "Team Management"],
    price: 75,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    availability: "Available this week",
    badge: "Top Rated",
    category: "Product",
    bio: "I'm a seasoned product manager with over 8 years of experience at top tech companies. I've led cross-functional teams to launch products used by millions of users. I'm passionate about helping aspiring product managers navigate their career journey and develop the skills needed to succeed in this dynamic field.",
    company: "Google",
    location: "San Francisco, CA",
    responseTime: "Usually responds within 2 hours",
    languages: ["English", "Spanish"],
    education: "MBA from Stanford University",
    totalSessions: 150,
    successRate: 98,
    pricing: {
      querySession: 150,
      oneOnOneSession: 500
    }
  };

  const sessionTypes = [
    {
      id: 'query',
      title: 'Query Session',
      price: mentorData.pricing?.querySession || 150,
      duration: '30 min',
      description: 'Ask specific questions and get expert advice',
      features: ['Direct Q&A', 'Quick feedback', 'Actionable insights'],
      icon: MessageCircle
    },
    {
      id: 'one-on-one',
      title: '1:1 Mentoring Session',
      price: mentorData.pricing?.oneOnOneSession || 500,
      duration: '60 min',
      description: 'Deep dive mentoring session with personalized guidance',
      features: ['Career roadmap', 'Skill assessment', 'Goal setting', 'Follow-up plan'],
      icon: Video
    }
  ];

  const reviews = [
    {
      id: 1,
      name: "Alex Chen",
      rating: 5,
      date: "2 weeks ago",
      comment: "Sarah provided incredible insights into product strategy. Her experience at Google really shows, and she gave me actionable advice for my current role.",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      rating: 5,
      date: "1 month ago",
      comment: "Amazing session! Sarah helped me prepare for my PM interviews and I got the job! Her mock interview was exactly what I needed.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      name: "David Kim",
      rating: 4,
      date: "2 months ago",
      comment: "Very knowledgeable and patient. Sarah explained complex product concepts in a way that was easy to understand.",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ];

  const handleBookSession = (sessionType) => {
    setSelectedSessionType(sessionType);
    setIsBookingModalOpen(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const BookingModal = () => {
    const selectedSession = sessionTypes.find(s => s.id === selectedSessionType);
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Book Session</h3>
            <button 
              onClick={() => setIsBookingModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <selectedSession.icon className="w-6 h-6 text-blue-600" />
                <h4 className="font-semibold text-blue-900">{selectedSession.title}</h4>
              </div>
              <p className="text-blue-700 text-sm mb-3">{selectedSession.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-900">₹{selectedSession.price}</span>
                <span className="text-blue-600 font-medium">{selectedSession.duration}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date & Time
              </label>
              <input
                type="datetime-local"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to discuss?
              </label>
              <textarea
                placeholder="Briefly describe what you'd like to cover in this session..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to mentors
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
              <div className="relative mb-4 md:mb-0">
                <img 
                  src={mentorData.image}
                  alt={mentorData.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {mentorData.badge && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ⭐ {mentorData.badge}
                  </div>
                )}
              </div>
              
              <div className="flex-1 md:ml-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{mentorData.name}</h1>
                    <p className="text-xl text-blue-600 font-semibold mb-2">{mentorData.role}</p>
                    <div className="flex items-center text-gray-600 space-x-4 mb-4">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        <span>{mentorData.company}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{mentorData.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">{mentorData.rating}</span>
                        <span className="text-gray-600 ml-1">({mentorData.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span className="font-medium">{mentorData.availability}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <button 
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={`p-3 rounded-xl border transition-colors ${
                        isFavorited 
                          ? 'bg-red-50 border-red-200 text-red-600' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{mentorData.bio}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mentorData.totalSessions}</div>
                  <div className="text-sm text-gray-600">Sessions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mentorData.successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{mentorData.reviews}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">2h</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {mentorData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold">{mentorData.rating}</span>
                  <span className="text-gray-600 ml-1">({mentorData.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Types */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book a Session</h3>
              <div className="space-y-4">
                {sessionTypes.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <session.icon className="w-6 h-6 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">{session.title}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">₹{session.price}</div>
                        <div className="text-sm text-gray-600">{session.duration}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                    <ul className="space-y-1 mb-4">
                      {session.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => handleBookSession(session.id)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Book {session.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Response Time</div>
                    <div className="text-sm text-gray-600">{mentorData.responseTime}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Education</div>
                    <div className="text-sm text-gray-600">{mentorData.education}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Languages</div>
                    <div className="text-sm text-gray-600">{Array.isArray(mentorData.languages) ? mentorData.languages.join(', ') : ''}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-blue-100 mb-4">
                Book a session with {mentorData.name} and accelerate your career growth.
              </p>
              <button 
                onClick={() => handleBookSession('query')}
                className="w-full bg-white text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Start with a Query Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && <BookingModal />}

      <Footer />
    </div>
  );
};

export default MentorProfilePage;