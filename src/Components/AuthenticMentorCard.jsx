import React from "react";
import { Star, Calendar, MapPin, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthenticMentorCard = ({ mentor, index = 0 }) => {
  const navigate = useNavigate();
  
  function handleViewProfile() {
    navigate('/ViewMentorProfile', { 
      state: { mentorData: mentor } 
    });
  }

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img 
              src={mentor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=3B82F6&color=fff`} 
              alt={mentor.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=3B82F6&color=fff`;
              }}
            />
            {mentor.badge && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {mentor.badge}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {mentor.name}
            </h3>
            <p className="text-blue-600 font-medium text-sm mb-1">{mentor.role}</p>
            <p className="text-gray-500 text-sm flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {mentor.experience || mentor.company || 'Remote'}
            </p>
          </div>
        </div>

        {/* Rating and reviews */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-semibold text-gray-700">{mentor.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({mentor.reviews} reviews)</span>
          </div>
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Available</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {(mentor.skills || []).slice(0, 3).map((skill, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {(mentor.skills || []).length > 3 && (
            <span className="text-gray-500 text-xs py-1">
              +{(mentor.skills || []).length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Availability and pricing */}
      <div className="px-6 pb-4">
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Clock className="w-4 h-4 mr-1" />
          <span>{mentor.availability || 'Usually responds within 2 hours'}</span>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center text-blue-700 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="font-medium">First session 30% off</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">${mentor.price || 75}</span>
              <span className="text-gray-500 text-sm ml-1">/session</span>
            </div>
            <div className="text-sm text-gray-500">60 min session</div>
          </div>
          
          <button 
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 group"
            onClick={handleViewProfile}
          >
            <span>View Profile</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthenticMentorCard;