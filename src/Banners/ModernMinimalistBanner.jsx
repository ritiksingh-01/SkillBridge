import React from 'react';
import { ArrowUpRight, Target, Rocket } from 'lucide-react';
import image1 from "../assets/1.jpg";

export function ModernMinimalistBanner() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Subtle background overlay to match image tone */}
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          {/* Content Section */}
          <div className="p-8 md:p-12 space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center space-x-4 mb-4">
                <Target className="w-8 h-8 text-amber-400" />
                <h3 className="text-lg font-semibold text-gray-200">Professional Elevation</h3>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
                Transform Your 
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  Career Journey
                </span>
              </h2>
              
              <p className="text-lg text-gray-300 mb-6">
                Unlock your potential with strategic mentorship designed to accelerate your professional growth and personal development.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="group flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-lg text-base font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                  Explore Opportunities
                  <ArrowUpRight className="ml-2 group-hover:rotate-45 transition-transform duration-300" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <Rocket className="w-6 h-6 text-amber-400" />
                  <span className="text-gray-400 text-sm">100% Career Growth</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-20 rounded-tl-3xl rounded-bl-3xl"></div>
            
            <div className="relative z-10">
              <div className="overflow-hidden rounded-tl-3xl rounded-bl-3xl shadow-2xl transform transition-transform duration-500 hover:scale-105">
                <img
                  src={image1}
                  alt="Professional Growth"
                  className="w-full h-[500px] md:h-[600px] object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </div>
            
            {/* Overlay Badge */}
            <div className="absolute bottom-4 right-4 left-4 bg-white/15 backdrop-blur-md rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm text-white">Live Mentorship Connections</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-300">24/7 Global Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}