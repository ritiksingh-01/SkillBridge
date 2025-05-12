import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Users, 
  Briefcase, 
  Calendar, 
  Globe, 
  Star, 
  CheckCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroSectionImage from '../assets/heroSectionImage.png'; 

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  function handleFindMentor(){
    navigate('/findMentorPage');
  }

  function handleClick(){
    navigate('/becomeMentor');
  }

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation for staggered appearance of elements
  const getAnimationDelay = (index) => {
    return { animationDelay: `${index * 0.1}s` };
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-yellow-300 opacity-20 animate-pulse" style={{animationDuration: '15s'}}></div>
        {/* <div className="absolute top-100 left-5 w-96 h-96 rounded-full bg-blue-300 opacity-10 animate-pulse" style={{animationDuration: '20s'}}></div> */}
        <div className="absolute top-40 right-40 w-32 h-32 rounded-full bg-pink-300 opacity-10 animate-pulse" style={{animationDuration: '12s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-15">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          {/* Left Content */}
          <div className={`w-full lg:w-1/2 flex flex-col justify-start items-start gap-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full shadow-sm transform hover:scale-105 transition-transform">
              <span className="text-blue-700 text-sm font-medium">Trusted by 10,000+ professionals</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Accelerate Your Career With Expert
              <span className="relative">
                <span className="text-blue-600 relative z-10"> Mentorship</span>
                <span className="absolute bottom-2 left-2 w-full h-3 bg-yellow-300 opacity-30 -z-0"></span>
              </span>
            </h1>
            
            <p className="text-gray-600 text-lg font-normal leading-relaxed mt-2">
              Connect with industry leaders who provide personalized guidance, practical insights, and help you navigate your professional journey effectively.
            </p>
            
            <div className="grid grid-cols-2 gap-4 md:gap-8 mt-4 w-full md:w-auto">
              {[
                { icon: <Users className="w-5 h-5 text-blue-600" />, number: "5,000+", text: "Expert Mentors" },
                { icon: <Briefcase className="w-5 h-5 text-blue-600" />, number: "500+", text: "Companies" },
                { icon: <Calendar className="w-5 h-5 text-blue-600" />, number: "20,000+", text: "Sessions Completed" },
                { icon: <Globe className="w-5 h-5 text-blue-600" />, number: "40+", text: "Countries" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={getAnimationDelay(index + 2)}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 shadow-md transform hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">{item.number}</p>
                    <p className="text-gray-500 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={getAnimationDelay(6)}>
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shadow-lg flex items-center justify-center gap-2 transition-all hover:translate-y-1 hover:shadow-xl" onClick={handleFindMentor}>
                <span className="text-white font-medium">Find Your Mentor</span>
                <ArrowRight className="w-4 h-4 text-white animate-pulse" />
              </button>
              
              <button className="px-8 py-3 bg-white border border-gray-300 hover:border-blue-600 hover:text-blue-600 rounded-lg cursor-pointer shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow-md" onClick={handleClick}>
                <span className="text-gray-700 font-medium">Become a Mentor</span>
              </button>
            </div>
            
            <div className={`mt-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={getAnimationDelay(7)}>
              <p className="text-gray-500 mb-2 text-sm">TRUSTED BY PROFESSIONALS FROM</p>
              <div className="flex flex-wrap items-center gap-8 opacity-80">
                {["GOOGLE", "MICROSOFT", "AMAZON", "META"].map((company, index) => (
                  <div 
                    key={index} 
                    className="h-8 text-gray-400 font-bold hover:text-blue-600 transition-colors cursor-pointer"
                    style={getAnimationDelay(index + 8)}
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Image and Stats */}
          <div className="relative w-full lg:w-1/2">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Purple Background Circle */}
              <div 
                className="absolute inset-0 rounded-full" 
                style={{
                  background: 'linear-gradient(to right, #7F56D9, #7F56D9)', 
                  border: '0.76px solid #7F56D9'
                }}
              ></div>

              {/* Main Image */}
              <img
                src={heroSectionImage}
                alt="Student with learning materials"
                className="relative z-10 object-cover w-full h-full rounded-full"
              />

              {/* Stat Cards */}
              <div className="absolute top-10 left-0 bg-white rounded-lg p-3 shadow-lg z-20 flex items-center gap-3 transform -translate-x-1/4">
                <div className="w-10 h-10 bg-[#f9f5ff] rounded flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="20" height="20" rx="4" fill="#7f56d9" fillOpacity="0.2" />
                    <path d="M5 7H15M5 10H15M5 13H10" stroke="#7f56d9" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-lg">2K+</div>
                  <div className="text-xs text-[#667085]">Video Courses</div>
                </div>
              </div>

              <div className="absolute top-1/4 right-0 bg-white rounded-lg p-3 shadow-lg z-20 flex items-center gap-3 transform translate-x-1/4">
                <div className="w-10 h-10 bg-[#f9f5ff] rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-[#7f56d9] rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div>
                  <div className="font-bold text-lg">5K+</div>
                  <div className="text-xs text-[#667085]">Online Courses</div>
                </div>
              </div>

              <div className="absolute bottom-10 right-0 bg-white rounded-lg p-3 shadow-lg z-20 flex items-center gap-3 transform translate-x-1/3">
                <div className="w-10 h-10 bg-[#f9f5ff] rounded flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="20" height="20" rx="4" fill="#7f56d9" fillOpacity="0.2" />
                    <path d="M10 4V16M4 10H16" stroke="#7f56d9" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-lg">250+</div>
                  <div className="text-xs text-[#667085]">Tutors</div>
                </div>
              </div>
            </div>

            {/* Background decoration circles */}
            <div className="absolute right-0 bottom-0 w-[600px] h-[600px] border border-[#eaecf0] rounded-full translate-x-1/3 translate-y-1/4 z-0"></div>
            <div className="absolute right-0 bottom-0 w-[500px] h-[500px] border border-[#eaecf0] rounded-full translate-x-1/3 translate-y-1/4 z-0"></div>
            <div className="absolute right-0 bottom-0 w-[400px] h-[400px] border border-[#eaecf0] rounded-full translate-x-1/3 translate-y-1/4 z-0"></div>

            {/* Purple dots */}
            <div className="absolute left-1/4 bottom-1/4 w-6 h-6 bg-[#7f56d9] rounded-full z-10"></div>
            <div className="absolute right-1/3 top-1/3 w-4 h-4 bg-[#7f56d9] rounded-full z-10"></div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;