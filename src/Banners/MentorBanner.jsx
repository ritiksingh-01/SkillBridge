import React from 'react';
import image1 from "../assets/image3.jpg";

export default function MentorBanner() {
  return (
    <div className="container mx-auto px-4 mt-16">
      <div className="relative bg-blue-600 rounded-3xl shadow-xl overflow-hidden">
        {/* Content Container */}
        <div className="flex items-center relative">
          {/* Text Content */}
          <div className="w-2/3 p-10 z-10 relative">
            <h2 className="text-3xl font-bold text-white mb-4">
              Become a mentor today
            </h2>
            <p className="text-blue-100 mb-6 text-lg">
              Share your expertise, build your personal brand, and earn while helping others grow in their careers.
            </p>
            <button className="px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-md font-medium">
              Apply as mentor
            </button>
          </div>

          {/* Image Section */}
          <div className="w-1/3 relative p-4">
            {/* Image Container */}
            <div className="relative z-10">
              {/* Skill Mastery Tag */}
              <div className="absolute top-4 -left-1 z-20">
                <span className="inline-block bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Skills
                </span>
              </div>

              {/* Career Growth Tag */}
              <div className="absolute bottom-4 -right-1 z-20">
                <span className="inline-block bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Growth Path
                </span>
              </div>

              {/* Blur Effect */}
              <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl"></div>
              
              {/* Circular Image */}
              <div className="relative">
                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                  <img 
                    src={image1} 
                    alt="Become a mentor" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-700/30 transform skew-x-12 origin-top-right"></div>
      </div>
    </div>
  );
}