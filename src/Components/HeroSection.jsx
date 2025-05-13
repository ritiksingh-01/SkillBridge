import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, 
  Users, 
  Briefcase, 
  Calendar, 
  Globe, 
  Book, 
  Award 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Image1 from '../assets/1.jpg'; 
import { motion } from "framer-motion";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  function handleFindMentor() {
    navigate('/findMentorPage');
  }

  function handleClick() {
    navigate('/becomeMentor');
  }

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-300 via-white to-indigo-300 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 py-16">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          {/* Left Content */}
          <motion.div 
            className="w-full lg:w-1/2 flex flex-col justify-start items-start gap-6"
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-3 py-1 bg-blue-200 rounded-full shadow-md transform hover:scale-105 transition-transform">
              <span className="text-blue-800 text-sm font-medium">Trusted by 10,000+ professionals</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Accelerate Your Career With Expert
              <span className="relative">
                <span className="text-blue-700 relative z-10"> Mentorship</span>
                <span className="absolute bottom-2 left-2 w-full h-3 bg-yellow-300 opacity-30 -z-0"></span>
              </span>
            </h1>
            
            <p className="text-gray-700 text-lg font-normal leading-relaxed mt-2">
              Connect with industry leaders who provide personalized guidance, practical insights, and help you navigate your professional journey effectively.
            </p>
            
            <div className="grid grid-cols-2 gap-4 md:gap-8 mt-4 w-full md:w-auto">
              {[
                { icon: <Users className="w-5 h-5 text-blue-600" />, number: "5,000+", text: "Expert Mentors" },
                { icon: <Briefcase className="w-5 h-5 text-blue-600" />, number: "500+", text: "Companies" },
                { icon: <Calendar className="w-5 h-5 text-blue-600" />, number: "20,000+", text: "Sessions Completed" },
                { icon: <Globe className="w-5 h-5 text-blue-600" />, number: "40+", text: "Countries" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 shadow-md transform hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">{item.number}</p>
                    <p className="text-gray-600 text-sm">{ item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
              <motion.button 
                className="px-8 py-3 bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer shadow-lg flex items-center justify-center gap-2 transition-all hover:translate-y-1 hover:shadow-xl"
                onClick={handleFindMentor}
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="text-white font-medium">Find Your Mentor</span>
                <ArrowRight className="w-4 h-4 text-white animate-pulse" />
              </motion.button>
              
              <motion.button 
                className="px-8 py-3 bg-white border border-gray-300 hover:border-blue-700 hover:text-blue-700 rounded-lg cursor-pointer shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow-md"
                onClick={handleClick}
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <span className="text-gray-800 font-medium">Become a Mentor</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column - Image and Stats */}
          <motion.div 
            className={`relative w-full lg:w-1/2`}
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-xl">
                <img 
                  src={Image1} 
                  alt="Mentor Image" 
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Stat Cards */}
              <motion.div 
                className="absolute top-10 left-0 bg-white rounded-lg p-3 shadow-lg z-20 flex items-center gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="w-10 h-10 bg-purple-50 rounded flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <div className="font-bold text-lg">8K+</div>
                  <div className="text-xs text-gray-500">Expert Mentors</div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute top-1/4 right-0 bg-white rounded-lg p-3 shadow-lg z-20 flex items-center gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : { y: 20, opacity:  0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <Book className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <div className="font-bold text-lg">200+</div>
                  <div className="text-xs text-gray-500">Skills Taught</div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute bottom-10 right-0 bg-white rounded-lg p-3 shadow-lg z-20 flex items-center gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <div className="w-10 h-10 bg-purple-50 rounded flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <div className="font-bold text-lg">15K+</div>
                  <div className="text-xs text-gray-500">Certifications</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
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