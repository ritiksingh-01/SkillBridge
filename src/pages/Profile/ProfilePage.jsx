import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  Camera,
  Star,
  Award,
  Calendar,
  Briefcase
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getProfile();
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use user data as fallback
      setProfile(user);
      setFormData(user);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await usersAPI.updateProfile(formData);
      setProfile(response.data);
      updateUser(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={profile?.profileImage || `https://ui-avatars.com/api/?name=${profile?.firstName}+${profile?.lastName}&size=128`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              {editing && (
                <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="absolute top-4 right-4">
            {editing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Basic Info */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {editing ? (
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={formData.firstName || ''}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          value={formData.lastName || ''}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      `${profile?.firstName} ${profile?.lastName}`
                    )}
                  </h1>
                  <p className="text-lg text-gray-600 capitalize">{profile?.role}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="border border-gray-300 rounded px-2 py-1"
                          placeholder="Phone number"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.location || ''}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="border border-gray-300 rounded px-2 py-1"
                          placeholder="Location"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.location || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Member since</p>
                      <p className="text-gray-900">
                        {new Date(profile?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  {editing ? (
                    <textarea
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700">
                      {profile?.bio || 'No bio provided yet.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              {user?.role === 'mentor' && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentor Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">Rating</span>
                      </div>
                      <span className="font-semibold">4.8/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">Mentees</span>
                      </div>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Sessions</span>
                      </div>
                      <span className="font-semibold">156</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'JavaScript', 'Node.js', 'Python', 'UI/UX'].map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;