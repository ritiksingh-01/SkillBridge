import React from "react";
import { Book, Award, TrendingUp, Briefcase, Zap } from "lucide-react";

const TrendingDomains = () => {
  const trendingDomains = [
    { name: "CV Review", icon: <Book className="h-5 w-5 text-blue-600" /> },
    { name: "MBA Preparation", icon: <Award className="h-5 w-5 text-purple-600" /> },
    { name: "Case Competition", icon: <TrendingUp className="h-5 w-5 text-red-600" /> },
    { name: "Placement Support", icon: <Briefcase className="h-5 w-5 text-yellow-600" /> },
    { name: "Technical Interview", icon: <Zap className="h-5 w-5 text-green-600" /> },
  ];

  return (
    <div className="bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">
            Trending Domains
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex flex-wrap gap-3 w-full">
            {trendingDomains.map((domain, index) => (
              <button
                key={index}
                className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50">
                  {domain.icon}
                </div>
                <span className="font-medium">{domain.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingDomains;