import React from "react";
import { Star, Calendar, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MentorCard = ({ mentor }) => {
  const navigate = useNavigate();
  
  function handleViewProfile(){
    navigate('/mentorProfile', { 
      state: { mentorData: mentor } 
    });
  }
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group relative h-full flex flex-col">
      {mentor.badge && (
        <div className="absolute top-4 right-4 z-10">
          <div className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium rounded-full">
            ✨ {mentor.badge}
          </div>
        </div>
      )}
      
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start gap-3 mb-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
              <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
              {mentor.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700 ml-1">{mentor.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({mentor.reviews} reviews)</span>
            </div>
            <p className="text-blue-600 font-medium text-sm mb-1">{mentor.role}</p>
            <p className="text-gray-600 text-sm">{mentor.experience}</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {mentor.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                {skill}
              </span>
            ))}
            {mentor.skills.length > 3 && (
              <span className="text-gray-500 text-xs py-1">
                +{mentor.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <Calendar className="w-4 h-4" />
            <span>{mentor.availability}</span>
          </div>
        </div>
        <div className="mb-5 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-green-600" />
            <span className="text-green-800 text-sm font-medium">🎁 First session 30 min free</span>
          </div>
        </div>
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">₹{mentor.price}</span>
                <span className="text-gray-600 text-sm">/hour</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Available now</span>
              </div>
            </div>
          </div>
          
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 group cursor-pointer"
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
export default MentorCard;