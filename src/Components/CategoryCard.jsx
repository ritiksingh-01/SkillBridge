import React from "react";
import { ArrowRight } from "lucide-react";

const CategoryCard = ({ icon, title, mentorsCount, color, isSpecial = false }) => {
  return (
    <div 
      className={`${color} rounded-xl p-6 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-200 group`}
    >
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        
        {isSpecial ? (
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
          </div>
        ) : null}
      </div>
      
      <h3 className="font-semibold text-lg mt-4 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{mentorsCount}</p>
      
      {isSpecial && (
        <div className="mt-4 inline-block text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
          Browse all categories
        </div>
      )}
    </div>
  );
};

export default CategoryCard;