import React from "react";
import { Star, Calendar, BookOpen } from "lucide-react";

const MentorCard = ({ mentor }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100 group relative h-full flex flex-col">
      {mentor.badge && (
        <div className="absolute top-4 right-4 z-10">
          <div className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium rounded-full">
            {mentor.badge}
          </div>
        </div>
      )}
      <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 ring-2 ring-white shadow-md">
            <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col mb-1">
              <h3 className="font-semibold text-gray-800 text-lg">{mentor.name}</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs ml-1 font-medium">{mentor.rating}</span>
                </div>
                <span className="text-xs text-gray-500 ml-1">({mentor.reviews})</span>
              </div>
            </div>
            
            <p className="text-blue-600 text-sm font-medium">{mentor.role}</p>
            <p className="text-gray-500 text-xs">{mentor.experience}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {mentor.skills.map((skill, index) => (
            <div key={index} className="bg-blue-50 rounded-full px-2 py-1">
              <span className="text-blue-700 text-xs">{skill}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{mentor.availability}</span>
        </div>
        
        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 text-xs font-medium">First session 30 min free</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <p className="text-gray-900 font-bold">${mentor.price}/hr</p>
            <p className="text-xs text-green-600 font-medium">Immediate booking</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm group-hover:shadow-md">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;