import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Users, 
  MessageCircle, 
  Shield, 
  ChevronDown,
  ArrowRight,
  Mail,
  Clock,
  CheckCircle,
  BookOpen,
  Zap,
  Globe
} from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const HelpPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const categories = [
    { id: 'all', label: 'All Topics', icon: <Globe className="w-4 h-4" /> },
    { id: 'getting-started', label: 'Getting Started', icon: <Zap className="w-4 h-4" /> },
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'sessions', label: 'Sessions', icon: <Users className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety', icon: <Shield className="w-4 h-4" /> }
  ];

  const helpTopics = [
    {
      id: 1,
      category: 'getting-started',
      title: 'How do I get started?',
      preview: 'Complete your profile, browse mentors, and book your first session',
      content: 'Getting started is simple: 1) Sign up and complete your profile with your goals and interests. 2) Browse our mentor directory using filters. 3) Book a session with a mentor who matches your needs. 4) Join your session at the scheduled time.'
    },
    {
      id: 2,
      category: 'getting-started',
      title: 'What should I expect from my first session?',
      preview: 'Your mentor will introduce themselves and discuss your goals',
      content: 'Your first session is about getting to know each other. Your mentor will ask about your background, goals, and what you hope to achieve. Come prepared with questions and be ready to discuss your challenges and aspirations.'
    },
    {
      id: 3,
      category: 'account',
      title: 'How do I create my profile?',
      preview: 'Add your goals, skills, and what you want to learn',
      content: 'Go to your profile settings and fill out: your current role, skills you want to develop, career goals, and a brief bio. This helps mentors understand how they can best help you.'
    },
    {
      id: 4,
      category: 'account',
      title: 'Can I edit my profile later?',
      preview: 'Yes, you can update your profile anytime',
      content: 'Your profile is always editable. Visit Settings > Profile to update your goals, skills, bio, or upload a new photo. Keep it current to get the most relevant mentor matches.'
    },
    {
      id: 5,
      category: 'sessions',
      title: 'How do I book a session?',
      preview: 'Choose a mentor, select a time, and confirm your booking',
      content: 'Find a mentor you like, click "Book Session", choose from their available times, add notes about what you want to discuss, and confirm. You\'ll receive a confirmation email with session details.'
    },
    {
      id: 6,
      category: 'sessions',
      title: 'What if I need to reschedule?',
      preview: 'You can reschedule up to 4 hours before your session',
      content: 'Go to "My Sessions", find your booking, and click "Reschedule". Choose a new time that works for both you and your mentor. Please reschedule at least 4 hours in advance to avoid cancellation fees.'
    },
    {
      id: 7,
      category: 'sessions',
      title: 'How do I join my session?',
      preview: 'Click the session link in your email or dashboard',
      content: 'You\'ll receive an email with a session link 1 hour before your meeting. You can also find the link in your dashboard under "Upcoming Sessions". Click to join the video call.'
    },
    {
      id: 8,
      category: 'safety',
      title: 'Is my information secure?',
      preview: 'Yes, we use enterprise-grade security to protect your data',
      content: 'We use SSL encryption, secure servers, and strict privacy policies. Your personal information is never shared with third parties without your consent. All mentors are verified professionals.'
    },
    {
      id: 9,
      category: 'safety',
      title: 'How do I report a problem?',
      preview: 'Use the report button or contact our support team',
      content: 'If you experience any issues, click the "Report" button in your session or message thread. For urgent matters, contact support immediately at help@skillbridge.com or use the live chat.'
    }
  ];

  const quickActions = [
    {
      icon: <User className="w-5 h-5" />,
      title: 'Update Profile',
      description: 'Add your goals and skills',
      action: 'Go to Profile'
    },
    {
      icon: <Search className="w-5 h-5" />,
      title: 'Find Mentors',
      description: 'Browse expert mentors',
      action: 'Browse Now'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Book Session',
      description: 'Schedule your first meeting',
      action: 'Book Now'
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'Get Support',
      description: 'Chat with our team',
      action: 'Start Chat'
    }
  ];

  const filteredTopics = helpTopics.filter(topic => {
    const matchesCategory = activeCategory === 'all' || topic.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50">
      {/* Page Header */}
      <Header/>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8 mt-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
            <p className="text-gray-600">Find answers and get support for SkillBridge</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-blue-600">
                    {action.icon}
                  </div>
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  {action.action}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredTopics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === topic.id ? null : topic.id)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{topic.title}</h3>
                    <p className="text-sm text-gray-600">{topic.preview}</p>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFAQ === topic.id ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </button>
              {expandedFAQ === topic.id && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <p className="text-gray-700 pt-4 leading-relaxed">{topic.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or browse all topics</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-16 bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Still need help?</h2>
            <p className="text-gray-600 mb-6">Our support team is here to help you succeed</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Start Live Chat
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                <Mail className="w-4 h-4" />
                Send Email
              </button>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>We typically respond within 2 hours</span>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default HelpPage;