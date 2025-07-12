import React from "react";
import { Star, Calendar, BookOpen, ArrowRight, MapPin, Award, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EnhancedMentorCard = ({ mentor, index = 0 }) => {
  const navigate = useNavigate();
  
  function handleViewProfile() {
    navigate('/ViewMentorProfile', { 
      state: { mentorData: mentor } 
    });
  }

  return (
    <motion.div 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-blue-200 h-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      {/* Header with Badge */}
      <div className="relative">
        {mentor.badge && (
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded-full shadow-lg">
              ✨ {mentor.badge}
            </div>
          </div>
        )}
        
        {/* Gradient Header */}
        <div className="h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600"></div>
        
        {/* Profile Section */}
        <div className="px-6 pb-6">
          <div className="flex items-start -mt-8 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                <img 
                  src={mentor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=3B82F6&color=fff`} 
                  alt={mentor.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=3B82F6&color=fff`;
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div className="ml-4 flex-1 pt-2">
              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {mentor.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-700 ml-1">{mentor.rating}</span>
                </div>
                <span className="text-sm text-gray-500">({mentor.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Role and Experience */}
          <div className="mb-4">
            <p className="text-blue-600 font-semibold text-sm mb-1">{mentor.role}</p>
            <p className="text-gray-600 text-sm flex items-center">
              <Award className="w-4 h-4 mr-1" />
              {mentor.experience}
            </p>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {(mentor.skills || []).slice(0, 3).map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  {skill}
                </span>
              ))}
              {(mentor.skills || []).length > 3 && (
                <span className="text-gray-500 text-xs py-1 px-2">
                  +{(mentor.skills || []).length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-600 gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">{mentor.availability}</span>
            </div>
          </div>

          {/* Special Offer */}
          <div className="mb-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-600" />
              <span className="text-green-800 text-sm font-semibold">🎁 First session 30% off</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">₹{mentor.price}</span>
                <span className="text-gray-600 text-sm">/session</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Available now</span>
              </div>
            </div>
            
            <button 
              className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              onClick={handleViewProfile}
            >
              <span>View Profile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedMentorCard;