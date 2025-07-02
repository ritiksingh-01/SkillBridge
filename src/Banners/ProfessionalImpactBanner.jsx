import React from 'react'; 
import image3 from "../assets/2.jpg";   

export function ProfessionalImpactBanner() {   
  return (     
    <div className="w-full px-6 md:px-16 lg:px-24 py-16">
      <div className="bg-white border-2 border-gray-100 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-2/3 p-8 md:p-12">
            <div className="border-l-4 border-blue-600 pl-6 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Your Success, Our Commitment
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Unlock strategic mentorship that transforms potential into remarkable professional achievements. Connect with industry experts who are dedicated to your growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors w-full sm:w-auto text-center">
                Join Our Community
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Verified Mentors</p>
                  <p className="text-xs text-gray-500">100% Trusted Professionals</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex space-x-4">
              <div className="bg-gray-100 rounded-xl p-4 text-center flex-1">
                <p className="text-2xl font-bold text-blue-600">250+</p>
                <p className="text-sm text-gray-600">Industries Covered</p>
              </div>
              <div className="bg-gray-100 rounded-xl p-4 text-center flex-1">
                <p className="text-2xl font-bold text-blue-600">5000+</p>
                <p className="text-sm text-gray-600">Happy Mentees</p>
              </div>
            </div>
          </div>
          <div className="hidden md:block md:w-1/3 relative">
            <div className="w-full h-[600px] clip-star overflow-hidden">
              <img
                src={image3}
                alt="Professional Impact"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ); 
}