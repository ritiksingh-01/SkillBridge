import React, { useState, useRef } from 'react';
import {
  Briefcase,
  Building,
  BookOpen,
  Award,
  ChevronLeft,
  FileText,
  ArrowRight,
  Linkedin,
  Youtube,
  Facebook,
  Instagram,
  Upload,
  User,
  DollarSign
} from 'lucide-react';
import Header from '../../Components/Header';
import { useNavigate } from 'react-router-dom';
import { mentorsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BecomeMentorPage = () => {
  const fileInputRef = useRef(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    gender: user?.gender || '',
    organization: '',
    industry: '',
    currentRole: '',
    workExperience: '',
    headline: '',
    bio: '',
    skillsInput: '',
    category: 'Technology',
    oneOnOnePrice: '500',
    queryPrice: '150',
    socialMedia: {
      linkedin: '',
      youtube: '',
      facebook: '',
      instagram: ''
    },
    profileImage: null
  });

  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
  };

  const handleResumeUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
      }, 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const skillsArray = formData.skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        organization: formData.organization,
        industry: formData.industry,
        currentRole: formData.currentRole,
        workExperience: formData.workExperience,
        headline: formData.headline,
        bio: formData.bio,
        expertise: skillsArray.length > 0 ? skillsArray : ['Mentorship', formData.currentRole],
        categories: [formData.category],
        pricing: {
          oneOnOneSession: parseInt(formData.oneOnOnePrice) || 500,
          querySession: parseInt(formData.queryPrice) || 150
        },
        availability: {
          timezone: 'Asia/Kolkata',
          schedule: []
        },
        resume: resumeFile ? {
          filename: resumeFile.name,
          url: URL.createObjectURL(resumeFile),
          uploadedAt: new Date()
        } : undefined
      };

      await mentorsAPI.apply(payload);

      // Update user in auth context to mentor role (F9)
      if (user) {
        updateUser({
          ...user,
          role: 'mentor'
        });
      }

      navigate('/mentor-dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to submit mentor application. Please check your details and try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const genderOptions = [
    { value: 'Male', icon: <User className="text-blue-600" /> },
    { value: 'Female', icon: <User className="text-pink-500" /> },
    { value: 'Non-binary', icon: <User className="text-purple-500" /> },
    { value: 'Other', icon: <User className="text-gray-600" /> }
  ];

  const categories = [
    'Technology', 'Business', 'Design', 'Marketing', 'Finance',
    'Leadership', 'Product', 'Engineering', 'Data', 'AI', 'Cloud', 'Security'
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24 py-8 mt-20">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Become a Mentor</h1>
            <p className="text-gray-600 mb-8">Share your expertise and guide the next generation of leaders.</p>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resume / CV Upload */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">Upload Resume / CV</h4>
                  <p className="text-xs text-gray-500">PDF, DOC up to 5MB</p>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleResumeUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Upload size={16} />
                    {resumeFile ? resumeFile.name : 'Choose File'}
                  </button>
                  {isUploading && <span className="text-xs text-blue-600 ml-2">Uploading...</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="First Name" required>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormField>

                <FormField label="Last Name" required>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Gender" required>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {genderOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleGenderSelect(option.value)}
                          className={`h-12 px-3 rounded-lg border cursor-pointer ${
                            formData.gender === option.value
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          } flex items-center gap-2 transition-colors`}
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            {option.icon}
                          </div>
                          <span className="text-sm font-medium">{option.value}</span>
                        </button>
                      ))}
                    </div>
                  </FormField>
                </div>

                <FormField label="Current Organisation / Company" required>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Google, Microsoft, Startup"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </FormField>

                <FormField label="Industry" required>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Software, Fintech, Edtech"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </FormField>

                <FormField label="Current Role" required>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="currentRole"
                      value={formData.currentRole}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </FormField>

                <FormField label="Years of Work Experience" required>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Award size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="workExperience"
                      value={formData.workExperience}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 5+ years"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Category" required>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Expertise & Skills (comma separated)" required>
                    <input
                      type="text"
                      name="skillsInput"
                      value={formData.skillsInput}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. React, Node.js, System Design, Career Growth"
                      className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormField>
                </div>

                <FormField label="1:1 Session Price (₹)" required>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="oneOnOnePrice"
                      value={formData.oneOnOnePrice}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </FormField>

                <FormField label="Query Session Price (₹)" required>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="queryPrice"
                      value={formData.queryPrice}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Professional Headline" required>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Senior PM @ Google helping aspiring product managers break into tech"
                      className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Bio & Background" required>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FileText size={18} className="text-gray-400" />
                      </div>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        required
                        className="w-full h-32 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell prospective mentees about your journey, expertise, and what they can achieve through your sessions."
                      ></textarea>
                    </div>
                  </FormField>
                </div>

                {/* Social media handles */}
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Social Media & Portfolio</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-12 rounded-lg border border-gray-300 flex items-center px-3 bg-white">
                      <Linkedin size={20} className="text-blue-700 mr-2" />
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.socialMedia.linkedin}
                        onChange={handleSocialMediaChange}
                        className="flex-1 outline-none text-sm text-gray-800"
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                    <div className="h-12 rounded-lg border border-gray-300 flex items-center px-3 bg-white">
                      <Youtube size={20} className="text-red-600 mr-2" />
                      <input
                        type="text"
                        name="youtube"
                        value={formData.socialMedia.youtube}
                        onChange={handleSocialMediaChange}
                        className="flex-1 outline-none text-sm text-gray-800"
                        placeholder="youtube.com/@channel"
                      />
                    </div>
                    <div className="h-12 rounded-lg border border-gray-300 flex items-center px-3 bg-white">
                      <Facebook size={20} className="text-blue-600 mr-2" />
                      <input
                        type="text"
                        name="facebook"
                        value={formData.socialMedia.facebook}
                        onChange={handleSocialMediaChange}
                        className="flex-1 outline-none text-sm text-gray-800"
                        placeholder="facebook.com/username"
                      />
                    </div>
                    <div className="h-12 rounded-lg border border-gray-300 flex items-center px-3 bg-white">
                      <Instagram size={20} className="text-pink-600 mr-2" />
                      <input
                        type="text"
                        name="instagram"
                        value={formData.socialMedia.instagram}
                        onChange={handleSocialMediaChange}
                        className="flex-1 outline-none text-sm text-gray-800"
                        placeholder="instagram.com/username"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer font-medium"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} SkillBridge. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

const FormField = ({ label, required = false, children }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
};

export default BecomeMentorPage;
