import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Search,
  Calendar,
  ChevronDown,
  Star
} from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { messagesAPI, sessionsAPI, mentorsAPI } from '../../services/api';

// Query Message Component
const QueryMessage = ({ message, timestamp }) => {
  return (
    <div className="flex justify-end mb-6">
      <div className="max-w-md">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md p-4 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold">Q</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="flex items-center justify-end mt-2 pt-2 border-t border-white border-opacity-20">
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
            <span className="text-sm font-semibold text-gray-700">Response</span>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed mb-3">{message}</p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Received</span>
            </span>
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mentor Card in Sidebar
const MentorListItem = ({ mentor, isSelected, onClick }) => {
  return (
    <div
      onClick={() => onClick(mentor)}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-blue-50/50 ${
        isSelected ? 'bg-blue-50/80 border-l-4 border-l-blue-600' : 'bg-white'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
              mentor.online ? 'bg-green-500' : 'bg-gray-400'
            }`}
          ></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 truncate text-sm">{mentor.name}</h4>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                mentor.status === 'confirmed' || mentor.status === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : mentor.status === 'completed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {mentor.status}
            </span>
          </div>
          <p className="text-xs text-gray-600 truncate mt-0.5">{mentor.title}</p>
          <p className="text-xs text-blue-600 truncate mt-1">
            {mentor.sessionTitle ? `Session: ${mentor.sessionTitle}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

const MessagePage = () => {
  const { user: authUser } = useAuth();
  const authUserRef = useRef(authUser);
  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  const [message, setMessage] = useState('');
  const [mentorsList, setMentorsList] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [queryMessages, setQueryMessages] = useState([]);
  const currentSessionRef = useRef(null);
  const { socket, joinRoom, leaveRoom } = useSocket();

  // Fetch real sessions from backend (F4)
  useEffect(() => {
    const loadConversationsAndSessions = async () => {
      try {
        const sessRes = await sessionsAPI.getAll();
        const rawSessions = sessRes.data?.sessions || [];

        if (rawSessions.length > 0) {
          const formatted = rawSessions.map(s => {
            const rawUser = localStorage.getItem('user');
            const currentUser = authUserRef.current || (rawUser ? JSON.parse(rawUser) : null);
            const currentUserId = currentUser?._id || currentUser?.id;

            const isMentee = s.mentee?._id?.toString() === currentUserId?.toString();
            const otherParty = isMentee
              ? (s.mentor?.user || { firstName: 'Mentor', lastName: '' })
              : (s.mentee || { firstName: 'Mentee', lastName: '' });

            const otherName = `${otherParty.firstName || ''} ${otherParty.lastName || ''}`.trim() || 'User';

            return {
              id: s._id,
              sessionId: s._id,
              mentorId: s.mentor?._id,
              receiverId: isMentee ? s.mentor?.user?._id : s.mentee?._id,
              name: otherName,
              title: s.mentor?.headline || s.mentor?.currentRole || s.type,
              sessionTitle: s.title,
              sessionType: s.type,
              avatar: otherParty.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherName)}&background=3B82F6&color=fff`,
              status: s.status,
              rating: s.mentor?.rating?.average || 5.0,
              online: true,
              responseTime: '~2 hours'
            };
          });

          setMentorsList(formatted);
          if (formatted.length > 0) {
            setSelectedMentor(prev => prev || formatted[0]);
          }
        } else {
          // If no active sessions, load mentors as prospective conversations
          const mentorsRes = await mentorsAPI.getAll();
          const mentors = mentorsRes.data?.mentors || [];
          const prospective = mentors.slice(0, 5).map(m => ({
            id: m._id,
            sessionId: null,
            mentorId: m._id,
            name: `${m.user?.firstName || ''} ${m.user?.lastName || ''}`.trim() || 'Mentor',
            title: m.currentRole || m.headline || 'Industry Expert',
            sessionTitle: 'General Mentorship',
            sessionType: 'query',
            avatar: m.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.user?.firstName || 'M')}&background=3B82F6&color=fff`,
            status: 'prospective',
            rating: m.rating?.average || 5.0,
            online: true,
            responseTime: '~2 hours'
          }));
          setMentorsList(prospective);
          if (prospective.length > 0) {
            setSelectedMentor(prev => prev || prospective[0]);
          }
        }
      } catch (err) {
        console.error('Error loading conversations:', err);
      }
    };

    loadConversationsAndSessions();
  }, []);

  // When selected conversation / session changes, join room and fetch messages (F4)
  useEffect(() => {
    if (!selectedMentor) return;

    const sessionId = selectedMentor.sessionId;
    if (!sessionId) {
      setQueryMessages([
        {
          id: 'welcome',
          type: 'response',
          text: `Welcome! You can book a session with ${selectedMentor.name} or send a question below.`,
          timestamp: 'Just now',
          status: 'received'
        }
      ]);
      return;
    }

    // Leave previous session room cleanly (F4)
    if (currentSessionRef.current && currentSessionRef.current !== sessionId) {
      leaveRoom(currentSessionRef.current);
    }

    currentSessionRef.current = sessionId;
    joinRoom(sessionId);

    // Fetch real session messages (F4)
    messagesAPI.getBySession(sessionId)
      .then(res => {
        if (res.data?.messages) {
          const rawUser = localStorage.getItem('user');
          const currentUser = authUserRef.current || (rawUser ? JSON.parse(rawUser) : null);
          const currentUid = currentUser?._id || currentUser?.id;

          const formatted = res.data.messages.map(msg => {
            const senderId = typeof msg.sender === 'object' ? (msg.sender?._id || msg.sender?.id) : msg.sender;
            const isSelf = senderId?.toString() === currentUid?.toString();

            return {
              id: msg._id,
              type: isSelf ? 'query' : 'response',
              text: msg.content,
              timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: isSelf ? 'sent' : 'received'
            };
          });
          setQueryMessages(formatted);
        }
      })
      .catch(err => {
        console.error('Error fetching session messages:', err);
      });

    return () => {
      if (currentSessionRef.current) {
        leaveRoom(currentSessionRef.current);
      }
    };
  }, [selectedMentor, joinRoom, leaveRoom]);

  // Listen to socket events for new messages - both 'new-message' and 'receive-message' (F4)
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (data) => {
      if (!data) return;

      const rawUser = localStorage.getItem('user');
      const currentUser = authUserRef.current || (rawUser ? JSON.parse(rawUser) : null);
      const currentUid = currentUser?._id || currentUser?.id;

      const dataSessionId = data.session?._id || data.session || data.sessionId || data.roomId;
      if (currentSessionRef.current && dataSessionId?.toString() === currentSessionRef.current?.toString()) {
        const senderId = typeof data.sender === 'object' ? (data.sender?._id || data.sender?.id) : data.sender;
        const isSelf = senderId?.toString() === currentUid?.toString();

        setQueryMessages(prev => {
          // Avoid duplicate messages
          if (prev.some(m => m.id === (data._id || data.id))) {
            return prev;
          }
          return [
            ...prev,
            {
              id: data._id || data.id || Date.now(),
              type: isSelf ? 'query' : 'response',
              text: data.content || data.message || '',
              timestamp: new Date(data.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: isSelf ? 'sent' : 'received'
            }
          ];
        });
      }
    };

    socket.on('new-message', handleIncomingMessage);
    socket.on('receive-message', handleIncomingMessage);

    return () => {
      socket.off('new-message', handleIncomingMessage);
      socket.off('receive-message', handleIncomingMessage);
    };
  }, [socket]);

  // Send message via API and real-time socket (F4)
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedMentor) return;

    let targetSessionId = selectedMentor.sessionId;

    // If no existing session, create a query session automatically
    if (!targetSessionId && selectedMentor.mentorId) {
      try {
        const newSessionRes = await sessionsAPI.create({
          mentorId: selectedMentor.mentorId,
          type: 'query',
          title: 'Direct Query',
          description: message
        });
        targetSessionId = newSessionRes.data?.session?._id;
        setSelectedMentor(prev => ({ ...prev, sessionId: targetSessionId }));
      } catch (err) {
        console.error('Failed to initialize session for message:', err);
      }
    }

    if (!targetSessionId) {
      alert('Could not start message session. Please book a session first.');
      return;
    }

    const contentToSend = message;
    setMessage('');

    try {
      const response = await messagesAPI.send({
        sessionId: targetSessionId,
        content: contentToSend,
        messageType: 'text'
      });

      if (response.data?.data) {
        const savedMsg = response.data.data;
        setQueryMessages(prev => [
          ...prev,
          {
            id: savedMsg._id || Date.now(),
            type: 'query',
            text: contentToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
          }
        ]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessage(contentToSend);
      alert('Failed to send message. Please try again.');
    }
  };

  const filteredMentors = mentorsList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || item.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchesTab = activeTab === 'all' || item.sessionType === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Header />

        <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Messages & Sessions</h2>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'all'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-800'
                  }`}
                >
                  All Conversations
                </button>
                <button
                  onClick={() => setActiveTab('query')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'query'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-800'
                  }`}
                >
                  Queries
                </button>
                <button
                  onClick={() => setActiveTab('one-on-one')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'one-on-one'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-800'
                  }`}
                >
                  1:1 Sessions
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Split Layout */}
          <div className="flex bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden" style={{ height: '650px' }}>
            {/* Left Side: Session Conversations List */}
            <div className="w-2/5 border-r border-gray-200 bg-gray-50 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Conversations</h3>
                <span className="text-xs text-gray-500">{filteredMentors.length} active</span>
              </div>
              <div className="overflow-y-auto flex-1">
                {filteredMentors.length > 0 ? (
                  filteredMentors.map((m) => (
                    <MentorListItem
                      key={m.id || m.sessionId}
                      mentor={m}
                      isSelected={selectedMentor?.id === m.id}
                      onClick={setSelectedMentor}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No active sessions found. Find a mentor and book a session to chat!
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Chat Window */}
            <div className="w-3/5 flex flex-col">
              {selectedMentor ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={selectedMentor.avatar}
                          alt={selectedMentor.name}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            selectedMentor.online ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        ></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{selectedMentor.name}</h4>
                        <p className="text-xs text-gray-500">{selectedMentor.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 font-medium rounded-full">
                        {selectedMentor.sessionTitle || 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                    {queryMessages.length === 0 ? (
                      <div className="text-center py-16 text-gray-400 text-sm">
                        No messages in this session yet. Say hello!
                      </div>
                    ) : (
                      queryMessages.map((msg) =>
                        msg.type === 'query' ? (
                          <QueryMessage key={msg.id} message={msg.text} timestamp={msg.timestamp} />
                        ) : (
                          <ResponseMessage key={msg.id} message={msg.text} timestamp={msg.timestamp} />
                        )
                      )
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  Select a session or mentor to start chatting.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MessagePage;
