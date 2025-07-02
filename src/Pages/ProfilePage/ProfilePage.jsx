import React, { useEffect, useState } from 'react';
import { usersAPI, mentorsAPI } from '../../services/api';
import MentorCard from '../../Components/MentorCard';
import Header from '../../Components/Header';
import ProfileHeader from '../../Components/Header';
import { TextField, TextAreaField, ArrayField, FileField } from '../../Components/FieldComponents';
import { Edit3, Save, X, CheckCircle, AlertCircle, Briefcase, GraduationCap, Link as LinkIcon, DollarSign, Clock } from 'lucide-react';

const categoriesList = [
  'Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Leadership', 
  'Product', 'Engineering', 'Data', 'AI', 'Cloud', 'Security'
];

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userRes = await usersAPI.getProfile();
        setUser(userRes.data.user);
        setFormData(userRes.data.user);
        setProfileImagePreview(userRes.data.user.profileImage || null);
        setCoverImagePreview(userRes.data.user.coverImage || null);
        
        if (userRes.data.user.role === 'mentor') {
          const mentorsRes = await mentorsAPI.getAll();
          const mentorProfile = (mentorsRes.data.mentors || []).find(m => 
            m.user && (typeof m.user === 'string' ? m.user === userRes.data.user._id : m.user._id === userRes.data.user._id)
          );
          if (mentorProfile) {
            setMentor(mentorProfile);
            setFormData({ ...userRes.data.user, ...mentorProfile });
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...(prev[parent] || {}), [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'profile') {
        setProfileImagePreview(reader.result);
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      } else if (type === 'cover') {
        setCoverImagePreview(reader.result);
        setFormData(prev => ({ ...prev, coverImage: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setFormData(prev => ({ ...prev, resume: file }));
    }
  };

  const handleArrayChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      await usersAPI.updateProfile(formData);
      
      if (user?.role === 'mentor' && mentor) {
        const mentorFields = [
          'organization', 'industry', 'currentRole', 'workExperience', 'headline', 'bio',
          'expertise', 'categories', 'pricing', 'availability', 'resume', 'education', 'experience'
        ];
        const mentorData = {};
        mentorFields.forEach(field => {
          if (formData[field] !== undefined) {
            mentorData[field] = formData[field];
          }
        });
        await mentorsAPI.updateProfile(mentor._id, mentorData);
      }
      
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && !user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
            <ProfileHeader
              coverImage={coverImagePreview}
              profileImage={profileImagePreview}
              name={`${user.firstName} ${user.lastName}`}
              role={user.role}
              location={formData.location}
              editMode={editMode}
              onCoverImageChange={(e) => handleImageChange(e, 'cover')}
              onProfileImageChange={(e) => handleImageChange(e, 'profile')}
            />
          </div>

          {/* Mentor Preview Card */}
          {user.role === 'mentor' && mentor && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Mentor Profile</h2>
              <MentorCard 
                mentor={{
                  name: `${user.firstName} ${user.lastName}`,
                  image: profileImagePreview || user.profileImage,
                  rating: mentor.rating?.average,
                  reviews: mentor.rating?.count,
                  skills: formData.expertise || [],
                  availability: formData.availability?.timezone || '',
                  price: formData.pricing?.oneOnOneSession || 0,
                  headline: formData.headline
                }} 
              />
            </div>
          )}

          {/* Main Form Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Form Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  editMode 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
                onClick={() => setEditMode(!editMode)}
                type="button"
              >
                {editMode ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">{success}</span>
              </div>
            )}
            
            {error && (
              <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSave} className="p-8 space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    required
                    editMode={editMode}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    required
                    editMode={editMode}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    type="email"
                    required
                    disabled
                    editMode={editMode}
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    type="tel"
                    editMode={editMode}
                    placeholder="+1 (555) 123-4567"
                  />
                  <TextField
                    label="Location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    editMode={editMode}
                    placeholder="City, Country"
                  />
                </div>
                
                <div className="mt-6">
                  <TextAreaField
                    label="About"
                    name="about"
                    value={formData.about || ''}
                    onChange={handleChange}
                    editMode={editMode}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Mentor-specific fields */}
              {user.role === 'mentor' && mentor && (
                <>
                  {/* Professional Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <Briefcase className="w-5 h-5 mr-3 text-blue-600" />
                      Professional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField
                        label="Organization"
                        name="organization"
                        value={formData.organization || ''}
                        onChange={handleChange}
                        required
                        editMode={editMode}
                        placeholder="Google, Microsoft, etc."
                      />
                      <TextField
                        label="Industry"
                        name="industry"
                        value={formData.industry || ''}
                        onChange={handleChange}
                        required
                        editMode={editMode}
                        placeholder="Technology, Finance, etc."
                      />
                      <TextField
                        label="Current Role"
                        name="currentRole"
                        value={formData.currentRole || ''}
                        onChange={handleChange}
                        required
                        editMode={editMode}
                        placeholder="Senior Software Engineer"
                      />
                      <TextField
                        label="Work Experience"
                        name="workExperience"
                        value={formData.workExperience || ''}
                        onChange={handleChange}
                        required
                        editMode={editMode}
                        placeholder="5 years"
                      />
                    </div>
                    
                    <div className="mt-6 space-y-6">
                      <TextField
                        label="Professional Headline"
                        name="headline"
                        value={formData.headline || ''}
                        onChange={handleChange}
                        required
                        editMode={editMode}
                        placeholder="Helping developers build scalable applications"
                      />
                      
                      <TextAreaField
                        label="Professional Bio"
                        name="bio"
                        value={formData.bio || ''}
                        onChange={handleChange}
                        required
                        editMode={editMode}
                        rows={4}
                        placeholder="Describe your experience, achievements, and mentoring approach..."
                      />
                      
                      <ArrayField
                        label="Areas of Expertise"
                        name="expertise"
                        value={formData.expertise || []}
                        onChange={handleArrayChange}
                        editMode={editMode}
                        placeholder="React, Node.js, Python, Data Science, etc."
                      />
                      
                      <ArrayField
                        label="Categories"
                        name="categories"
                        value={formData.categories || []}
                        onChange={handleArrayChange}
                        editMode={editMode}
                        options={categoriesList}
                      />
                    </div>
                  </div>

                  {/* Pricing & Availability */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                      Pricing & Availability
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField
                        label="Query Session Price (₹)"
                        name="pricing.querySession"
                        value={(formData.pricing?.querySession || '').toString()}
                        onChange={handleChange}
                        type="number"
                        editMode={editMode}
                        placeholder="50"
                      />
                      <TextField
                        label="1-on-1 Session Price (₹)"
                        name="pricing.oneOnOneSession"
                        value={(formData.pricing?.oneOnOneSession || '').toString()}
                        onChange={handleChange}
                        type="number"
                        editMode={editMode}
                        placeholder="100"
                      />
                      <TextField
                        label="Timezone"
                        name="availability.timezone"
                        value={formData.availability?.timezone || ''}
                        onChange={handleChange}
                        editMode={editMode}
                        placeholder="PST, IST, GMT, etc."
                      />
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-3 text-purple-600" />
                      Documents & Resume
                    </h3>
                    <FileField
                      label="Resume (PDF)"
                      value={formData.resume}
                      onChange={handleResumeChange}
                      editMode={editMode}
                      accept="application/pdf"
                    />
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <LinkIcon className="w-5 h-5 mr-3 text-indigo-600" />
                      Social Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField
                        label="LinkedIn"
                        name="socialLinks.linkedin"
                        value={formData.socialLinks?.linkedin || ''}
                        onChange={handleChange}
                        editMode={editMode}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                      <TextField
                        label="GitHub"
                        name="socialLinks.github"
                        value={formData.socialLinks?.github || ''}
                        onChange={handleChange}
                        editMode={editMode}
                        placeholder="https://github.com/yourusername"
                      />
                      <TextField
                        label="Personal Website"
                        name="socialLinks.website"
                        value={formData.socialLinks?.website || ''}
                        onChange={handleChange}
                        editMode={editMode}
                        placeholder="https://yourwebsite.com"
                      />
                      <TextField
                        label="Twitter"
                        name="socialLinks.twitter"
                        value={formData.socialLinks?.twitter || ''}
                        onChange={handleChange}
                        editMode={editMode}
                        placeholder="https://twitter.com/yourusername"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Save Button */}
              {editMode && (
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;