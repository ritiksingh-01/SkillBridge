import React, { useState } from 'react';
import { Send, Paperclip, ArrowLeft, Search, Calendar, ChevronDown, MoreVertical, Phone, Video, Clock, Star, Filter } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
// Query Message Component
const QueryMessage = ({ message, timestamp, onAttachment }) => {
  return (
    <div className="flex justify-end mb-6">
      <div className="max-w-md">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md p-4 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold">Q</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-semibold">Query</span>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">₹150</span>
              </div>
              <p className="text-white text-sm leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white border-opacity-20">
            <button 
              onClick={onAttachment}
              className="flex items-center space-x-1 text-white text-opacity-80 hover:text-white transition-colors"
            >
              <Paperclip className="w-4 h-4" />
              <span className="text-xs">Attachment</span>
            </button>
            <span className="text-xs text-white text-opacity-70">{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Response Message Component
const ResponseMessage = ({ message, timestamp }) => {
  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-sm">
          <div className="mb-2">
            <span className="text-sm font-semibold text-gray-700">Mentor Response</span>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed mb-3">{message}</p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Response received</span>
            </span>
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Session Message Component
const SessionMessage = ({ type, message, timestamp, duration }) => {
  const isScheduled = type === 'scheduled';
  return (
    <div className={`flex ${isScheduled ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className="max-w-md">
        <div className={`${
          isScheduled 
            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
            : 'bg-white border border-gray-200 text-gray-800'
        } rounded-2xl p-4 shadow-sm`}>
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 ${
              isScheduled ? 'bg-white bg-opacity-20' : 'bg-purple-100'
            } rounded-full flex items-center justify-center flex-shrink-0`}>
              <Calendar className={`w-4 h-4 ${isScheduled ? 'text-white' : 'text-purple-600'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-semibold">
                  {isScheduled ? '1:1 Session Scheduled' : 'Session Completed'}
                </span>
                {duration && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isScheduled ? 'bg-white bg-opacity-20' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {duration}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed">{message}</p>
            </div>
          </div>
          <div className={`flex justify-end mt-3 pt-3 border-t ${
            isScheduled ? 'border-white border-opacity-20' : 'border-gray-200'
          }`}>
            <span className={`text-xs ${
              isScheduled ? 'text-white text-opacity-70' : 'text-gray-500'
            }`}>{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Message Input Component for Queries
const QueryInput = ({ value, onChange, onSend, questionCount = 0, maxQuestions = 2 }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Ask Question ({questionCount}/{maxQuestions})
          </span>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(maxQuestions)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full mx-0.5 ${
                    i < questionCount ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={value}
              onChange={onChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask your question here..."
              className="w-full resize-none border-0 bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0"
              rows={2}
              style={{ minHeight: '40px', maxHeight: '120px' }}
              disabled={questionCount >= maxQuestions}
            />
          </div>
          <button
            onClick={onSend}
            disabled={!value.trim() || questionCount >= maxQuestions}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {questionCount >= maxQuestions && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              You've reached the maximum number of questions for this session. 
              <button className="ml-1 text-blue-600 hover:underline">Upgrade to ask more</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Session Input Component for 1:1 Sessions
const SessionInput = ({ onScheduleSession }) => {
  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
        <div className="text-center">
          <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Schedule 1:1 Session</h3>
          <p className="text-sm text-gray-600 mb-4">
            Book a personalized session with your mentor
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => onScheduleSession('video')}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </button>
            <button
              onClick={() => onScheduleSession('phone')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Phone Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Mentor Card Component
const MentorCard = ({ mentor, isSelected, onClick }) => {
  return (
    <div 
      onClick={() => onClick(mentor)}
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
        isSelected ? 'bg-blue-50 border-r-4 border-r-blue-500 shadow-sm' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <img 
            src={mentor.avatar}
            alt={mentor.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            mentor.online ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800 truncate">{mentor.name}</h3>
              <p className="text-xs text-gray-600 truncate mt-0.5">{mentor.title}</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  mentor.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                  mentor.status === 'Active' ? 'bg-green-100 text-green-700' : 
                  'bg-gray-100 text-gray-600'
                }`}>
                  {mentor.status}
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">{mentor.rating}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Due on</div>
              <div className="text-xs font-medium text-gray-700">12 Sep 24</div>
              <div className="text-xs text-gray-500">12:45 PM IST</div>
            </div>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>Response time: ~2 hours</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Message Page Component
const MessagePage = () => {
  const [message, setMessage] = useState('');
  const [questionCount, setQuestionCount] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [activeTab, setActiveTab] = useState('query'); // Fixed: Added state for tab switching
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Mock mentors data
  const mentors = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Director & Head - Global CyberSecurity Engineering at PepsiCo",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face&auto=format",
      status: "Pending",
      rating: 4.9,
      online: true,
      responseTime: "~2 hours"
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Senior Software Engineer at Google, Ex-Facebook",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format",
      status: "Active",
      rating: 4.8,
      online: false,
      responseTime: "~4 hours"
    },
    {
      id: 3,
      name: "David Rodriguez",
      title: "Product Manager at Microsoft, MBA from Stanford",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face&auto=format",
      status: "Pending",
      rating: 4.7,
      online: true,
      responseTime: "~1 hour"
    }
  ];

  // Mock messages data for different tabs
  const [queryMessages, setQueryMessages] = useState([
    {
      id: 1,
      type: 'query',
      text: 'Is my resume perfect to apply for internship? Please help me to make a perfect resume.',
      timestamp: '2:30 PM',
      status: 'sent'
    },
    {
      id: 2,
      type: 'response',
      text: 'This resume would not work anywhere. The formatting is incorrect, so is the colour coding and the way everything has been presented. I can make one for you, I\'d charge INR 599, and your resume would be ready by Sunday. You can use that to apply anywhere since that would be perfectly formatted and ATS compliant as well. Let me know if you want to go ahead.',
      timestamp: '2:45 PM',
      status: 'received'
    }
  ]);

  const [sessionMessages, setSessionMessages] = useState([
    {
      id: 1,
      type: 'scheduled',
      text: 'Career guidance and resume review session scheduled for tomorrow at 3:00 PM',
      timestamp: '1:15 PM',
      duration: '60 min'
    },
    {
      id: 2,
      type: 'completed',
      text: 'Great session on interview preparation! Thanks for all the tips.',
      timestamp: 'Yesterday 4:30 PM',
      duration: '45 min'
    }
  ]);

  // Filter mentors based on search and status
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || mentor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSendMessage = () => {
    if (message.trim() && questionCount < 2) {
      const newMessage = {
        id: queryMessages.length + 1,
        type: 'query',
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      setQueryMessages([...queryMessages, newMessage]);
      setMessage('');
      setQuestionCount(prev => prev + 1);
    }
  };

  const handleScheduleSession = (type) => {
    const newSession = {
      id: sessionMessages.length + 1,
      type: 'scheduled',
      text: `New ${type === 'video' ? 'video' : 'phone'} session scheduled with ${selectedMentor?.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: '60 min'
    };
    setSessionMessages([...sessionMessages, newSession]);
  };

  const handleAttachment = () => {
    console.log('Attachment clicked');
  };

  const handleMentorSelect = (mentor) => {
    setSelectedMentor(mentor);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Mentor Sessions</h2>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-0">
              <button 
                onClick={() => handleTabSwitch('query')}
                className={`px-6 py-3 text-lg font-medium border-b-2 transition-colors ${
                  activeTab === 'query' 
                    ? 'text-blue-600 border-blue-500' 
                    : 'text-gray-600 border-transparent hover:text-gray-800'
                }`}
              >
                Query Sessions
              </button>
              <button 
                onClick={() => handleTabSwitch('session')}
                className={`px-6 py-3 text-lg font-medium border-b-2 transition-colors ${
                  activeTab === 'session' 
                    ? 'text-blue-600 border-blue-500' 
                    : 'text-gray-600 border-transparent hover:text-gray-800'
                }`}
              >
                1:1 Sessions
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Filter by:</span>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Split Layout */}
        <div className="flex bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden" style={{ height: '700px' }}>
          {/* Left Side - Mentor List */}
          <div className="w-2/5 border-r border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {activeTab === 'query' ? 'Query Mentors' : 'Session Mentors'}
                </h3>
                <span className="text-sm text-gray-500">
                  {filteredMentors.length} available
                </span>
              </div>
            </div>
            <div className="overflow-y-auto" style={{ height: 'calc(700px - 80px)' }}>
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    isSelected={selectedMentor?.id === mentor.id}
                    onClick={handleMentorSelect}
                  />
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-2">No mentors found</div>
                  <div className="text-sm text-gray-500">Try adjusting your search or filter</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="w-3/5 flex flex-col">
            {selectedMentor ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={selectedMentor.avatar}
                        alt={selectedMentor.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        selectedMentor.online ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{selectedMentor.name}</h3>
                      <p className="text-sm text-gray-600">{selectedMentor.title}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{selectedMentor.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{selectedMentor.responseTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedMentor.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                      selectedMentor.status === 'Active' ? 'bg-green-100 text-green-700' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedMentor.status}
                    </div>
                    {activeTab === 'session' && (
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Schedule</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                  {activeTab === 'query' ? (
                    queryMessages.map((msg) => (
                      msg.type === 'query' ? (
                        <QueryMessage
                          key={msg.id}
                          message={msg.text}
                          timestamp={msg.timestamp}
                          onAttachment={handleAttachment}
                        />
                      ) : (
                        <ResponseMessage
                          key={msg.id}
                          message={msg.text}
                          timestamp={msg.timestamp}
                        />
                      )
                    ))
                  ) : (
                    sessionMessages.map((msg) => (
                      <SessionMessage
                        key={msg.id}
                        type={msg.type}
                        message={msg.text}
                        timestamp={msg.timestamp}
                        duration={msg.duration}
                      />
                    ))
                  )}
                </div>

                {/* Message Input */}
                {activeTab === 'query' ? (
                  <QueryInput
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onSend={handleSendMessage}
                    questionCount={questionCount}
                    maxQuestions={2}
                  />
                ) : (
                  <SessionInput onScheduleSession={handleScheduleSession} />
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Select a mentor to start
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Choose a mentor from the list to {activeTab === 'query' ? 'ask questions' : 'schedule a session'} and get personalized guidance for your career journey.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default MessagePage;