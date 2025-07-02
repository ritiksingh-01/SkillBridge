import React from 'react';
import image1 from "../assets/2.jpg";

export default function MentorshipBanner() {
  return (
    <div className="container mx-auto px-4 mt-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-2xl overflow-hidden shadow-lg">
        <div className="flex items-center">
          {/* Text Content */}
          <div className="w-2/3 p-10">
            <h1 className="text-4xl font-bold text-white mb-4">
              Transform Your Potential Through Mentorship
            </h1>
            <p className="text-purple-100 text-lg mb-6">
              Unlock personalized insights, forge meaningful connections, and accelerate your professional journey.
            </p>
            <div>
              <button className="px-8 py-3 bg-white text-indigo-700 rounded-lg hover:bg-purple-50 transition-colors shadow-md font-semibold">
                Start Your Journey
              </button>
            </div>
          </div>
          {/* Image Section */}
          <div className="w-1/3 p-4 relative">
            <div className="relative z-10">
              <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                <img 
                  src={image1} 
                  alt="Mentorship Connection" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Quick Benefit Tags */}
              <div className="absolute top-2 -left-4 z-20">
                <span className="inline-block bg-teal-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg">
                  Personal Growth
                </span>
              </div>
              <div className="absolute bottom-2 -right-4 z-20">
                <span className="inline-block bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg">
                  Strategic Guidance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}