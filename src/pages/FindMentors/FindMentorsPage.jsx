import React, { useState, useEffect } from 'react';
import { mentorsAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock,
  DollarSign,
  Users,
  BookOpen
} from 'lucide-react';

const FindMentorsPage = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    skills: [],
    priceRange: '',
    rating: '',
    availability: ''
  });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      // Mock mentors data
      const mockMentors = [
        {
          id: '1',
          user: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            profileImage: 'https://ui-avatars.com/api/?name=Sarah+Johnson'
          },
          currentRole: 'Senior Software Engineer',
          organization: 'Google',
          expertise: ['React', 'JavaScript', 'Node.js', 'System Design'],
          rating: { average: 4.9, count: 24 },
          pricing: { oneOnOneSession: 150 },
          bio: 'Experienced software engineer with 8+ years in web development. Passionate about mentoring and helping others grow.',
          availability: 'Available this week',
          location: 'San Francisco, CA'
        },
        {
          id: '2',
          user: {
            firstName: 'Michael',
            lastName: 'Chen',
            profileImage: 'https://ui-avatars.com/api/?name=Michael+Chen'
          },
          currentRole: 'Product Manager',
          organization: 'Microsoft',
          expertise: ['Product Strategy', 'User Research', 'Data Analysis', 'Leadership'],
          rating: { average: 4.8, count: 18 },
          pricing: { oneOnOneSession: 120 },
          bio: 'Product manager with experience in B2B and B2C products. Love helping aspiring PMs navigate their career.',
          availability: 'Available next week',
          location: 'Seattle, WA'
        },
        {
          id: '3',
          user: {
            firstName: 'Emily',
            lastName: 'Davis',
            profileImage: 'https://ui-avatars.com/api/?name=Emily+Davis'
          },
          currentRole: 'UX Design Lead',
          organization: 'Apple',
          expertise: ['UI/UX Design', 'Design Systems', 'User Research', 'Prototyping'],
          rating: { average: 5.0, count: 31 },
          pricing: { oneOnOneSession: 180 },
          bio: 'Design leader with 10+ years of experience. Specialized in creating user-centered design solutions.',
          availability: 'Limited availability',
          location: 'Cupertino, CA'
        }
      ];
      setMentors(mockMentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = 
      mentor.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner text="Finding mentors..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Mentors</h1>
        <p className="text-gray-600">
          Connect with experienced professionals who can guide your career journey
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, role, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={mentor.user.profileImage}
                alt={`${mentor.user.firstName} ${mentor.user.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {mentor.user.firstName} {mentor.user.lastName}
                </h3>
                <p className="text-blue-600 font-medium">{mentor.currentRole}</p>
                <p className="text-gray-600 text-sm">{mentor.organization}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{mentor.rating.average}</span>
                  <span className="text-sm text-gray-500">({mentor.rating.count})</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-4 line-clamp-3">{mentor.bio}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{mentor.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{mentor.availability}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>${mentor.pricing.oneOnOneSession}/session</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {mentor.expertise.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{mentor.expertise.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Book Session
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find more mentors.
          </p>
        </div>
      )}
    </div>
  );
};

export default FindMentorsPage;