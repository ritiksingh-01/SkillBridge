import React, { useState } from 'react';
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
  Instagram
} from 'lucide-react';
import Header from '../Components/Header';

const BecomeMentorPage = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form submission
    console.log('Form submitted:', formData);
    // Continue with next steps (e.g., API call)
  };

  const handleBack = () => {
    // Handle back navigation
    console.log('Going back');
  };

  const handleGuidelines = () => {
    // Show guidelines for mentors
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
              className="mr-4 p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
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
                  icon={<Building size={18} className="text-gray-400" />}
                >
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your current organization"
                  />
                </FormField>

                {/* Industry */}
                <FormField
                  label="Industry"
                  required={true}
                  icon={<BookOpen size={18} className="text-gray-400" />}
                >
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your industry"
                  />
                </FormField>

                {/* Current Role */}
                <FormField
                  label="Current Role"
                  required={true}
                  icon={<Briefcase size={18} className="text-gray-400" />}
                >
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your current role"
                  />
                </FormField>

                {/* Work Experience */}
                <FormField
                  label="Work Experience"
                  required={true}
                  icon={<Award size={18} className="text-gray-400" />}
                >
                  <input
                    type="text"
                    name="workExperience"
                    value={formData.workExperience}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Years of experience"
                  />
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
                    icon={<FileText size={18} className="text-gray-400 mt-2" />}
                  >
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      required
                      className="w-full h-32 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself, your expertise, and why you want to mentor others"
                    ></textarea>
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

// Reusable Form Field Component
const FormField = ({ label, required = false, children, icon = null }) => {
  return (
    <div className="relative">
      <label className="block text-base font-medium text-gray-700 mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {icon && (
        <div className="absolute left-3 top-[41px] transform -translate-y-1/2 pointer-events-none">
          {icon}
        </div>
      )}
      {children}
    </div>
  );
};

// Import the missing User icon for gender options
const User = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
};

export default BecomeMentorPage;