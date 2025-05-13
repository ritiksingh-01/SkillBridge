import React, { useState, useEffect } from "react";
import { ArrowRight, Mail } from "lucide-react";

const NewsletterSignup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Animate component on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div 
        className={`bg-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className="flex flex-col lg:flex-row gap-10 justify-between items-center">
          <div className={`w-full lg:w-1/2 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4 animate-pulse">
              <Mail className="w-4 h-4 text-blue-700 mr-2" />
              <span className="text-blue-700 text-sm font-medium">Stay Updated</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Get Expert Career Tips and Opportunities</h2>
            <p className="text-gray-600 mb-6">
              Join our newsletter and receive exclusive mentorship insights, industry trends, and special offers. We'll help you stay ahead in your professional journey.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${isSubmitted ? 'border-green-500 bg-green-50' : ''}`}
              />
              <button 
                type="submit"
                className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${isSubmitted ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                <span>{isSubmitted ? 'Subscribed!' : 'Subscribe'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isSubmitted ? 'translate-x-1' : ''}`} />
              </button>
            </form>
            
            <p className="text-gray-500 text-xs mt-3">
              We respect your privacy and will never share your information. Unsubscribe anytime.
            </p>
          </div>
          
          <div className={`w-full lg:w-1/2 flex justify-center lg:justify-end transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-200 to-indigo-100 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-blue-300 to-indigo-200 rounded-full flex items-center justify-center transition-all duration-1000 hover:scale-105">
                  <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-blue-400 to-indigo-300 rounded-full flex items-center justify-center transition-all duration-1000 hover:scale-105">
                    <div className="w-16 h-16 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-indigo-400 rounded-full flex items-center justify-center transition-all duration-1000 hover:scale-105">
                      <div className="w-8 h-8 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 hover:scale-105"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div 
                className={`absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-800 font-medium">Weekly Insights</span>
                </div>
              </div>
              
              <div 
                className={`absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-white p-4 rounded-lg shadow-lg transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">+</span>
                  </div>
                  <span className="text-gray-800 font-medium">Career Resources</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;