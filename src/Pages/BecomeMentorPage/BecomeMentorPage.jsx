import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Briefcase, 
  Building, 
  BookOpen, 
  Award, 
  Info, 
  ChevronLeft, 
  FileText, 
  ArrowRight,
  Linkedin,
  Youtube,
  Facebook,
  Instagram,
  Upload,
  User
} from 'lucide-react';
import Header from '../../Components/Header';
import { useNavigate } from 'react-router-dom';

const BecomeMentorPage = () => {
  const fileInputRef = useRef(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    organization: '',
    industry: '',
    currentRole: '',
    workExperience: '',
    headline: '',
    bio: '',
    socialMedia: {
      linkedin: '',
      youtube: '',
      facebook: '',
      instagram: ''
    },
    profileImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      socialMedia: {
        ...formData.socialMedia,
        [name]: value
      }
    });
  };

  const handleGenderSelect = (gender) => {
    setFormData({
      ...formData,
      gender
    });
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        profileImage: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleResumeUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleBack = () => {
    navigate('/')
  };

  const handleGuidelines = () => {
    console.log('Showing guidelines');
  };

  const genderOptions = [
    { value: 'Male', icon: <User className="text-blue-600" /> },
    { value: 'Female', icon: <User className="text-pink-500" /> },
    { value: 'Non-binary', icon: <User className="text-purple-500" /> },
    { value: 'Transgender', icon: <User className="text-green-500" /> },
    { value: 'Intersex', icon: <User className="text-yellow-500" /> },
    { value: 'Other', icon: <User className="text-gray-600" /> }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Import Header Component */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center pt-32 pb-16 px-4">
        <div className="w-full max-w-5xl">
          <div className="flex items-center mb-8">
            <button 
              onClick={handleBack}
              className="mr-4 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Become a Mentor!</h1>
              <p className="text-lg text-gray-600 mt-1">Share your knowledge and help others grow professionally</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
            {/* Profile Banner */}
            <div className="relative h-64">
              <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              
              {/* Profile Image */}
              <div className="absolute bottom-0 left-10 transform translate-y-1/2">
                <div className="w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                  {formData.profileImage ? (
                    <img 
                      src={formData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                      <User size={64} className="text-blue-300" />
                    </div>
                  )}
                </div>
                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-600 transition-colors">
                  <Camera size={18} className="text-white" />
                  <input 
                    type="file" 
                    id="profile-upload" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              
              <div className="absolute bottom-4 right-8">
                <button 
                  type="button"
                  onClick={handleGuidelines}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:bg-blue-50 transition-colors"
                >
                  <Info size={16} />
                  Mentor Guidelines
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="px-8 pt-24 pb-8 mt-4">
              {/* Resume Upload Section */}
              <div className="mb-8 p-4 border border-dashed border-blue-300 bg-blue-50 rounded-lg">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <Upload size={24} />
                    </div>
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-lg font-medium text-gray-800 mb-1">Upload Your Resume</h3>
                    <p className="text-sm text-gray-600 mb-3">Attach your resume to your mentor profile</p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : "Upload Resume"}
                        <Upload size={16} />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept=".pdf,.doc,.docx" 
                        className="hidden" 
                        onChange={handleResumeUpload}
                      />
                      {resumeFile && (
                        <span className="text-sm text-gray-600 flex items-center">
                          {resumeFile.name}
                          {isUploading && (
                            <span className="ml-2 inline-block w-4 h-4 border-2 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                {/* First Name */}
                <FormField
                  label="First Name"
                  required={true}
                >
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </FormField>

                {/* Last Name */}
                <FormField
                  label="Last Name"
                  required={true}
                >
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </FormField>

                {/* Gender */}
                <div className="md:col-span-2">
                  <FormField
                    label="Gender"
                    required={true}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {genderOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleGenderSelect(option.value)}
                          className={`h-12 px-3 rounded-lg border ${
                            formData.gender === option.value 
                              ? 'bg-blue-50 border-blue-500 text-blue-700' 
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          } flex items-center gap-2 transition-colors`}
                        >
                          <div className="w-6 h-6 flex items-center justify-center">
                            {option.icon}
                          </div>
                          <span className="text-sm font-medium">{option.value}</span>
                        </button>
                      ))}
                    </div>
                  </FormField>
                </div>

                {/* Organization */}
                <FormField
                  label="Current Organisation/Institute"
                  required={true}
                >
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
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your current organization"
                    />
                  </div>
                </FormField>

                {/* Industry */}
                <FormField
                  label="Industry"
                  required={true}
                >
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
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your industry"
                    />
                  </div>
                </FormField>

                {/* Current Role */}
                <FormField
                  label="Current Role"
                  required={true}
                >
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
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your current role"
                    />
                  </div>
                </FormField>

                {/* Work Experience */}
                <FormField
                  label="Work Experience"
                  required={true}
                >
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
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Years of experience"
                    />
                  </div>
                </FormField>

                {/* Headline */}
                <div className="md:col-span-2">
                  <FormField
                    label="Professional Headline"
                    required={true}
                  >
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="A brief professional headline about yourself"
                    />
                  </FormField>
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <FormField
                    label="Bio/About you"
                    required={true}
                  >
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FileText size={18} className="text-gray-400" />
                      </div>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        required
                        className="w-full h-32 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about yourself, your expertise, and why you want to mentor others"
                      ></textarea>
                    </div>
                  </FormField>
                </div>

                {/* Social Media */}
                <div className="md:col-span-2">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Social Media Handles
                  </label>
                  
                  <div className="space-y-3">
                    {/* LinkedIn */}
                    <div className="h-12 rounded-lg border border-gray-300 flex items-center overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                      <div className="flex items-center justify-center ml-3 mr-2">
                        <Linkedin size={20} className="text-blue-700" />
                      </div>
                      <div className="border-l border-gray-300 h-8"></div>
                      <span className="mx-3 text-gray-500 text-sm">linkedin.com/in/</span>
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.socialMedia.linkedin}
                        onChange={handleSocialMediaChange}
                        className="flex-1 h-full outline-none text-gray-800 pr-3"
                        placeholder="your-profile"
                      />
                    </div>

                    {/* YouTube */}
                    <div className="h-12 rounded-lg border border-gray-300 flex items-center overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                      <div className="flex items-center justify-center ml-3 mr-2">
                        <Youtube size={20} className="text-red-600" />
                      </div>
                      <div className="border-l border-gray-300 h-8"></div>
                      <span className="mx-3 text-gray-500 text-sm">youtube.com/</span>
                      <input
                        type="text"
                        name="youtube"
                        value={formData.socialMedia.youtube}
                        onChange={handleSocialMediaChange}
                        className="flex-1 h-full outline-none text-gray-800 pr-3"
                        placeholder="your-channel"
                      />
                    </div>

                    {/* Facebook */}
                    <div className="h-12 rounded-lg border border-gray-300 flex items-center overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                      <div className="flex items-center justify-center ml-3 mr-2">
                        <Facebook size={20} className="text-blue-600" />
                      </div>
                      <div className="border-l border-gray-300 h-8"></div>
                      <span className="mx-3 text-gray-500 text-sm">facebook.com/</span>
                      <input
                        type="text"
                        name="facebook"
                        value={formData.socialMedia.facebook}
                        onChange={handleSocialMediaChange}
                        className="flex-1 h-full outline-none text-gray-800 pr-3"
                        placeholder="your-profile"
                      />
                    </div>

                    {/* Instagram */}
                    <div className="h-12 rounded-lg border border-gray-300 flex items-center overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                      <div className="flex items-center justify-center ml-3 mr-2">
                        <Instagram size={20} className="text-pink-600" />
                      </div>
                      <div className="border-l border-gray-300 h-8"></div>
                      <span className="mx-3 text-gray-500 text-sm">instagram.com/</span>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.socialMedia.instagram}
                        onChange={handleSocialMediaChange}
                        className="flex-1 h-full outline-none text-gray-800 pr-3"
                        placeholder="your-username"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-12">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-3 text-blue-600 border border-blue-600 rounded-lg text-base font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Next
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-8 lg:px-16 xl:px-24">
          <div className="text-gray-600 text-sm md:text-base mb-4 md:mb-0">© 2025 SkillBridge. All Rights Reserved.</div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <a href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm md:text-base transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-gray-600 hover:text-blue-600 text-sm md:text-base transition-colors">Terms of Service</a>
            <a href="/contact" className="text-gray-600 hover:text-blue-600 text-sm md:text-base transition-colors">Contact Us</a>
            <a href="/faq" className="text-gray-600 hover:text-blue-600 text-sm md:text-base transition-colors">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FormField = ({ label, required = false, children }) => {
  return (
    <div>
      <label className="block text-base font-medium text-gray-700 mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
};

export default BecomeMentorPage;