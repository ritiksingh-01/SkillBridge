
import React, { useState } from 'react';
import { 
  User, BookOpen, MessageSquare, Bell, Settings, FileText, 
  Users, Calendar, Star, Edit3, Share2, Eye, Upload, Camera,
  Plus, X, Save, MapPin, Mail, Phone, Linkedin, Github, Globe,
  LogOut, Briefcase, Award, ExternalLink, Building, ChevronRight,
  Sparkles, TrendingUp, Target, Zap
} from 'lucide-react';
import Header from '../../Components/Header';

const MenteeProfile = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [profile, setProfile] = useState({
    name: 'Ritik Singh',
    username: '@ritiksin22244',
    email: 'ytterbic.ermine.udbw@letterpro.com',
    university: 'GLA University',
    about: '',
    skills: [],
    education: [],
    experience: [],
    socialLinks: {
      linkedin: '',
      github: '',
      website: '',
      email: 'ytterbic.ermine.udbw@letterpro.com'
    },
    phone: '',
    location: '',
    profileImage: '👨‍💼',
    coverImage: null
  });

  const sidebarItems = [
    { id: 'profile', label: 'View Profile', icon: User, color: 'blue' },
    { id: 'complete', label: 'Complete Your Profile', icon: Star, color: 'yellow', badge: 'Hot' },
    { id: 'mentor-directory', label: 'Mentor Directory', icon: Users, color: 'purple' },
    { id: 'book-session', label: 'Book a Session', icon: Calendar, color: 'green' },
    { id: 'my-sessions', label: 'My Sessions', icon: MessageSquare, color: 'indigo' },
    { id: 'my-mentors', label: 'My Mentors', icon: Users, color: 'pink' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'blue', badge: '3' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'orange', badge: '5' },
    { id: 'resume', label: 'My Resume', icon: FileText, color: 'teal' },
    { id: 'feedback', label: 'Feedback', icon: Star, color: 'yellow' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' }
  ];

  const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  const AboutModal = () => {
    const [about, setAbout] = useState(profile.about);
    const handleSave = () => {
      setProfile(prev => ({ ...prev, about }));
      setActiveModal(null);
    };

    return (
      <Modal title="Add About" onClose={() => setActiveModal(null)}>
        <div className="space-y-4">
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell us about yourself, your passions, and what drives you..."
            className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-3">
            <button 
              onClick={handleSave} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              Save Changes
            </button>
            <button 
              onClick={() => setActiveModal(null)} 
              className="flex-1 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const SkillsModal = () => {
    const [skills, setSkills] = useState([...profile.skills]);
    const [newSkill, setNewSkill] = useState('');

    const addSkill = () => {
      if (newSkill.trim()) {
        setSkills([...skills, newSkill.trim()]);
        setNewSkill('');
      }
    };

    const removeSkill = (index) => {
      setSkills(skills.filter((_, i) => i !== index));
    };

    const handleSave = () => {
      setProfile(prev => ({ ...prev, skills }));
      setActiveModal(null);
    };

    return (
      <Modal title="Add Skills" onClose={() => setActiveModal(null)}>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter skill (e.g., React, Python, Design)"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <button 
              onClick={addSkill} 
              className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {skills.map((skill, index) => (
              <span key={index} className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-sm">
                {skill}
                <button 
                  onClick={() => removeSkill(index)} 
                  className="hover:bg-blue-300 rounded-full p-1 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSave} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              Save Skills
            </button>
            <button 
              onClick={() => setActiveModal(null)} 
              className="flex-1 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const EducationModal = () => {
    const [education, setEducation] = useState([...profile.education]);
    const [newEd, setNewEd] = useState({ school: '', degree: '', year: '', grade: '' });

    const addEducation = () => {
      if (newEd.school && newEd.degree) {
        setEducation([...education, newEd]);
        setNewEd({ school: '', degree: '', year: '', grade: '' });
      }
    };

    const handleSave = () => {
      setProfile(prev => ({ ...prev, education }));
      setActiveModal(null);
    };

    return (
      <Modal title="Add Education" onClose={() => setActiveModal(null)}>
        <div className="space-y-4">
          <input
            value={newEd.school}
            onChange={(e) => setNewEd({...newEd, school: e.target.value})}
            placeholder="School/University"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            value={newEd.degree}
            onChange={(e) => setNewEd({...newEd, degree: e.target.value})}
            placeholder="Degree/Course"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <input
              value={newEd.year}
              onChange={(e) => setNewEd({...newEd, year: e.target.value})}
              placeholder="Year"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              value={newEd.grade}
              onChange={(e) => setNewEd({...newEd, grade: e.target.value})}
              placeholder="Grade/CGPA"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={addEducation} 
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Add Education
          </button>
          
          <div className="max-h-40 overflow-y-auto space-y-2">
            {education.map((ed, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="font-medium text-gray-900">{ed.degree}</div>
                <div className="text-sm text-gray-600">{ed.school}</div>
                <div className="text-sm text-gray-500">{ed.year} • {ed.grade}</div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleSave} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              Save Education
            </button>
            <button 
              onClick={() => setActiveModal(null)} 
              className="flex-1 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const ExperienceModal = () => {
    const [experience, setExperience] = useState([...profile.experience]);
    const [newExp, setNewExp] = useState({ 
      company: '', 
      position: '', 
      duration: '', 
      description: '',
      location: ''
    });

    const addExperience = () => {
      if (newExp.company && newExp.position) {
        setExperience([...experience, newExp]);
        setNewExp({ company: '', position: '', duration: '', description: '', location: '' });
      }
    };

    const handleSave = () => {
      setProfile(prev => ({ ...prev, experience }));
      setActiveModal(null);
    };

    return (
      <Modal title="Add Experience" onClose={() => setActiveModal(null)}>
        <div className="space-y-4">
          <input
            value={newExp.position}
            onChange={(e) => setNewExp({...newExp, position: e.target.value})}
            placeholder="Position/Role"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            value={newExp.company}
            onChange={(e) => setNewExp({...newExp, company: e.target.value})}
            placeholder="Company Name"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <input
              value={newExp.duration}
              onChange={(e) => setNewExp({...newExp, duration: e.target.value})}
              placeholder="Duration (e.g., Jan 2023 - Present)"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              value={newExp.location}
              onChange={(e) => setNewExp({...newExp, location: e.target.value})}
              placeholder="Location"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <textarea
            value={newExp.description}
            onChange={(e) => setNewExp({...newExp, description: e.target.value})}
            placeholder="Description of your role and achievements..."
            className="w-full h-24 p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            onClick={addExperience} 
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Add Experience
          </button>
          
          <div className="max-h-40 overflow-y-auto space-y-2">
            {experience.map((exp, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="font-medium text-gray-900">{exp.position}</div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Building size={12} />
                  {exp.company} • {exp.location}
                </div>
                <div className="text-sm text-gray-500">{exp.duration}</div>
                {exp.description && (
                  <div className="text-sm text-gray-600 mt-1">{exp.description}</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleSave} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              Save Experience
            </button>
            <button 
              onClick={() => setActiveModal(null)} 
              className="flex-1 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const SocialLinksModal = () => {
    const [socialLinks, setSocialLinks] = useState({...profile.socialLinks});

    const handleSave = () => {
      setProfile(prev => ({ ...prev, socialLinks }));
      setActiveModal(null);
    };

    return (
      <Modal title="Social Links" onClose={() => setActiveModal(null)}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Linkedin size={20} className="text-blue-600" />
            </div>
            <input
              value={socialLinks.linkedin}
              onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
              placeholder="LinkedIn Profile URL"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Github size={20} className="text-gray-800" />
            </div>
            <input
              value={socialLinks.github}
              onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
              placeholder="GitHub Profile URL"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe size={20} className="text-green-600" />
            </div>
            <input
              value={socialLinks.website}
              onChange={(e) => setSocialLinks({...socialLinks, website: e.target.value})}
              placeholder="Personal Website URL"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Mail size={20} className="text-red-500" />
            </div>
            <input
              value={socialLinks.email}
              onChange={(e) => setSocialLinks({...socialLinks, email: e.target.value})}
              placeholder="Email Address"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSave} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              Save Links
            </button>
            <button 
              onClick={() => setActiveModal(null)} 
              className="flex-1 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const ProfileModal = () => {
    const [tempProfile, setTempProfile] = useState({
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
      profileImage: profile.profileImage
    });

    const handleSave = () => {
      setProfile(prev => ({ ...prev, ...tempProfile }));
      setActiveModal(null);
    };

    return (
      <Modal title="Edit Profile" onClose={() => setActiveModal(null)}>
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                {tempProfile.profileImage}
              </div>
              <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                <Camera size={14} />
              </button>
            </div>
          </div>
          <input
            value={tempProfile.name}
            onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
            placeholder="Full Name"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            value={tempProfile.phone}
            onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
            placeholder="Phone Number"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            value={tempProfile.location}
            onChange={(e) => setTempProfile({...tempProfile, location: e.target.value})}
            placeholder="Location"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-3">
            <button 
              onClick={handleSave} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              Save Profile
            </button>
            <button 
              onClick={() => setActiveModal(null)} 
              className="flex-1 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const getProgressPercentage = () => {
    let completed = 0;
    const total = 8;
    
    if (profile.about) completed++;
    if (profile.skills.length > 0) completed++;
    if (profile.education.length > 0) completed++;
    if (profile.experience.length > 0) completed++;
    if (profile.phone) completed++;
    if (profile.location) completed++;
    if (profile.socialLinks.linkedin || profile.socialLinks.github || profile.socialLinks.website) completed++;
    completed++; // Basic info always present
    
    return Math.round((completed / total) * 100);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Enhanced Header */}

      <Header/>

      <div className="flex mt-20">
        {/* Enhanced Sticky Sidebar */}
        <div className="w-80 min-w-80 bg-white/90 backdrop-blur-lg shadow-xl border-r border-white/20 sticky top-16 h-screen overflow-hidden flex flex-col">
          {/* Profile Section */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center text-xl border-4 border-white shadow-lg">
                  {profile.profileImage}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg">
                  {getProgressPercentage()}%
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg truncate">{profile.name}</h3>
                <p className="text-sm text-gray-500 truncate">{profile.email}</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Section */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Profile Completion</span>
                <span className="font-bold text-green-600">{getProgressPercentage()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-700 shadow-sm relative overflow-hidden" 
                  style={{ width: `${getProgressPercentage()}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">🚀 Complete your profile to unlock premium features!</p>
            </div>
          </div>

          {/* Scrollable Navigation Items */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="p-4 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-r-4 hover:border-blue-500 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg group-hover:bg-${item.color}-100 transition-colors`}>
                      <item.icon size={18} className={`text-gray-500 group-hover:text-${item.color}-600`} />
                    </div>
                    <span className="text-gray-700 group-hover:text-blue-900 text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.badge === 'Hot' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      } font-medium`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100 bg-white/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 hover:border-r-4 hover:border-red-500 rounded-xl transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                <LogOut size={18} className="text-gray-500 group-hover:text-red-600" />
              </div>
              <span className="text-gray-700 group-hover:text-red-900 text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Cover Photo */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 h-48 rounded-2xl relative mb-8 overflow-hidden">
            <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-white/30">
              <Camera size={16} />
            </button>
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>
          </div>

          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 -mt-16 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-lg">
                    {profile.profileImage}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
                    {getProgressPercentage()}%
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.name}</h1>
                  <p className="text-gray-500 text-lg mb-2">{profile.username}</p>
                  <div className="flex items-center text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <BookOpen size={16} className="mr-2 text-blue-500" />
                      <span>{profile.university}</span>
                    </div>
                    {profile.location && (
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1 text-gray-400" />
                        <span className="text-sm">{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Share2 size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Eye size={18} />
                </button>
                <button 
                  onClick={() => setActiveModal('profile')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center"
                >
                  <Edit3 size={16} className="mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              {profile.about ? (
                <div>
                  <p className="text-gray-600 mb-4">{profile.about}</p>
                  <button 
                    onClick={() => setActiveModal('about')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit About
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">Tell us about yourself...</p>
                  <button 
                    onClick={() => setActiveModal('about')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add About
                  </button>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
              {profile.skills.length > 0 ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveModal('skills')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit Skills
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">Showcase your skills...</p>
                  <button 
                    onClick={() => setActiveModal('skills')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add Skills
                  </button>
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase size={20} className="mr-2 text-blue-500" />
                Experience
              </h2>
              {profile.experience.length > 0 ? (
                <div>
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="mb-4 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="font-medium text-gray-900">{exp.position}</div>
                      <div className="text-gray-600 flex items-center gap-1">
                        <Building size={12} />
                        {exp.company} • {exp.location}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">{exp.duration}</div>
                      {exp.description && (
                        <div className="text-sm text-gray-600">{exp.description}</div>
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={() => setActiveModal('experience')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit Experience
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">Add your work experience...</p>
                  <button 
                    onClick={() => setActiveModal('experience')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add Experience
                  </button>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe size={20} className="mr-2 text-green-500" />
                Social Links
              </h2>
              <div className="space-y-3">
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <Linkedin size={18} className="text-blue-600" />
                    <span className="text-gray-700 text-sm">LinkedIn Profile</span>
                    <ExternalLink size={14} className="text-gray-400 ml-auto" />
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <Github size={18} className="text-gray-800" />
                    <span className="text-gray-700 text-sm">GitHub Profile</span>
                    <ExternalLink size={14} className="text-gray-400 ml-auto" />
                  </a>
                )}
                {profile.socialLinks.website && (
                  <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors">
                    <Globe size={18} className="text-green-600" />
                    <span className="text-gray-700 text-sm">Personal Website</span>
                    <ExternalLink size={14} className="text-gray-400 ml-auto" />
                  </a>
                )}
                {profile.socialLinks.email && (
                  <a href={`mailto:${profile.socialLinks.email}`}
                     className="flex items-center gap-3 p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Mail size={18} className="text-red-500" />
                    <span className="text-gray-700 text-sm">Email</span>
                    <ExternalLink size={14} className="text-gray-400 ml-auto" />
                  </a>
                )}
                {(!profile.socialLinks.linkedin && !profile.socialLinks.github && !profile.socialLinks.website) && (
                  <p className="text-gray-500 mb-4">Connect with others through your social profiles...</p>
                )}
                <button 
                  onClick={() => setActiveModal('socialLinks')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {(profile.socialLinks.linkedin || profile.socialLinks.github || profile.socialLinks.website) ? 'Edit Links' : 'Add Social Links'}
                </button>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen size={20} className="mr-2 text-purple-500" />
                Education
              </h2>
              {profile.education.length > 0 ? (
                <div>
                  {profile.education.map((ed, index) => (
                    <div key={index} className="mb-4 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="font-medium text-gray-900">{ed.degree}</div>
                      <div className="text-gray-600">{ed.school}</div>
                      <div className="text-sm text-gray-500">{ed.year} • {ed.grade}</div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setActiveModal('education')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit Education
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">Add your academic background...</p>
                  <button 
                    onClick={() => setActiveModal('education')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add Education
                  </button>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award size={20} className="mr-2 text-yellow-500" />
                Achievements
              </h2>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award size={24} className="text-yellow-500" />
                </div>
                <p className="text-gray-500 mb-4">Showcase your achievements and certifications...</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Add Achievements
                </button>
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText size={20} className="mr-2 text-indigo-500" />
                Resume
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <p className="text-gray-600 mb-4">Upload your resume to auto-fill your profile and increase visibility</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center mx-auto shadow-lg">
                    <Upload size={16} className="mr-2" />
                    Upload Resume
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Supported formats: PDF, DOC, DOCX</span>
                <span>Max size: 5MB</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Profile Views</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Connections</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">Mentorship Sessions</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{getProgressPercentage()}%</div>
                  <div className="text-sm text-gray-600">Profile Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'about' && <AboutModal />}
      {activeModal === 'skills' && <SkillsModal />}
      {activeModal === 'education' && <EducationModal />}
      {activeModal === 'experience' && <ExperienceModal />}
      {activeModal === 'socialLinks' && <SocialLinksModal />}
      {activeModal === 'profile' && <ProfileModal />}
    </div>
  );
};

export default MenteeProfile;