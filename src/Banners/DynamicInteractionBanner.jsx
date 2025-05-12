import React from 'react';
import { ArrowRight, CheckCircle, Users, Trophy } from 'lucide-react';
import image3 from "../assets/3.jpg";

export function DynamicInteractionBanner() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-br from-teal-600 to-blue-800 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
        
        <div className="relative z-10 grid grid-cols-2 gap-8 items-center">
          {/* Content Section */}
          <div className="p-12 text-white space-y-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h2 className="text-5xl font-extrabold mb-4 leading-tight">
                Unlock Your Potential
              </h2>
              <p className="text-white/90 text-xl mb-6">
                Transform your career with personalized mentorship designed to accelerate your growth and break through limitations.
              </p>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center px-10 py-4 bg-white text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl">
                  Get Started <ArrowRight className="ml-2" />
                </button>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-5 flex items-center space-x-4">
                <Users className="text-white w-10 h-10" />
                <div>
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-sm text-white/70">Expert Mentors</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-5 flex items-center space-x-4">
                <Trophy className="text-white w-10 h-10" />
                <div>
                  <p className="text-3xl font-bold text-white">1000+</p>
                  <p className="text-sm text-white/70">Success Stories</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="relative h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 rounded-l-3xl opacity-30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4/5 h-4/5 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-in-out">
                <img
                  src={image3}
                  alt="Mentorship Connection"
                  className="w-full h-full object-cover opacity-90 hover:opacity-100"
                />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center space-x-4">
              <CheckCircle className="text-green-400 w-8 h-8" />
              <p className="text-white text-sm">
                Verified Mentors | Personalized Matching | Guaranteed Results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}